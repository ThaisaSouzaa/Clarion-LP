(function () {
  var FORM_ID = "clarion-form";
  var API_URL = new URL(
    "/wp-json/mosten/lead-forge-clarion",
    window.location.origin,
  ).href;
  var LP_KEY = "lp-clarion-campanha";
  var THANK_YOU_URL = "/clarionads/typ/";
  var FORM_SLUG = "campanha_meta_ads_l_carion";
  var ORIGEM_FALLBACK = "LP Clarion Campanha - mosten.com/clarionads";
  var UTM_KEYS = [
    "utm_campaign",
    "utm_source",
    "utm_content",
    "utm_medium",
    "utm_term",
  ];

  var form = document.getElementById(FORM_ID);
  if (!form) return;

  var steps = form.querySelectorAll(".clarion-form__step");
  var progressBar = document.getElementById("clarion-form-progress-bar");
  var submitBtn = form.querySelector(".clarion-form__btn-submit");
  var isSubmitting = false;
  var currentStep = 0;

  function setSubmitting(value) {
    isSubmitting = value;
    if (submitBtn) submitBtn.disabled = value;
  }

  function persistUtmsFromUrl() {
    try {
      var params = new URLSearchParams(window.location.search);
      UTM_KEYS.forEach(function (key) {
        var value = params.get(key);
        if (value) sessionStorage.setItem(key, value);
      });
    } catch (_) {}
  }

  function getUtmParams() {
    var params = new URLSearchParams(window.location.search);
    var utm = {};

    UTM_KEYS.forEach(function (key) {
      var value = params.get(key);
      if (value) {
        utm[key] = value;
      } else {
        try {
          var stored = sessionStorage.getItem(key);
          if (stored) utm[key] = stored;
        } catch (_) {}
      }
    });

    if (!utm.utm_source) utm.utm_source = ORIGEM_FALLBACK;
    return utm;
  }

  function buildThankYouUrl() {
    var url = new URL(THANK_YOU_URL, window.location.origin);
    var utm = getUtmParams();
    UTM_KEYS.forEach(function (key) {
      if (utm[key]) url.searchParams.set(key, utm[key]);
    });
    return url.toString();
  }

  function getStepInput(stepIndex) {
    return steps[stepIndex].querySelector(
      "input:not([type=hidden]):not([type=checkbox]), select, textarea",
    );
  }

  function focusStepInput(stepIndex) {
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        var input = getStepInput(stepIndex);
        if (input) input.focus({ preventScroll: true });
      });
    });
  }

  function updateProgress() {
    if (!progressBar) return;
    progressBar.style.width = ((currentStep + 1) / steps.length) * 100 + "%";
  }

  function showStep(index) {
    steps.forEach(function (step) {
      step.classList.remove("active");
    });
    steps[index].classList.add("active");

    var empresa = document.getElementById("clarion-empresa").value;
    var faturamentoTitle = document.getElementById("clarion-faturamento-title");
    if (faturamentoTitle) {
      faturamentoTitle.innerHTML = empresa
        ? "Qual o faturamento anual da " + empresa + "? <span>*</span>"
        : "Qual o faturamento anual da sua empresa? <span>*</span>";
    }

    focusStepInput(index);
  }

  function isLastStep() {
    return currentStep >= steps.length - 1;
  }

  function nextStep() {
    if (currentStep >= steps.length - 1) return;
    currentStep++;
    showStep(currentStep);
    updateProgress();
  }

  function getCurrentStepInput() {
    return getStepInput(currentStep);
  }

  function advanceCurrentStep() {
    var currentInput = getCurrentStepInput();
    if (currentInput && !currentInput.checkValidity()) {
      currentInput.reportValidity();
      return false;
    }
    nextStep();
    return true;
  }

  function resetForm() {
    form.reset();
    currentStep = 0;
    setSubmitting(false);
    form.querySelectorAll(".clarion-form__option-card").forEach(function (card) {
      card.classList.remove("selected");
    });
    var faturamento = document.getElementById("clarion-faturamento");
    if (faturamento) faturamento.value = "";
    var status = document.getElementById("clarion-form-status");
    if (status) {
      status.classList.remove("is-error");
      status.textContent = "";
    }
    showStep(0);
    updateProgress();
  }

  window.clarionResetForm = resetForm;

  form.querySelectorAll(".clarion-form__btn-next").forEach(function (btn) {
    btn.addEventListener("click", advanceCurrentStep);
  });

  form.addEventListener("keydown", function (e) {
    if (e.key !== "Enter") return;
    if (
      !e.target.matches(
        "input:not([type=hidden]):not([type=checkbox]), select, textarea",
      )
    )
      return;
    e.preventDefault();
    if (isLastStep()) {
      form.requestSubmit();
      return;
    }
    advanceCurrentStep();
  });

  var telefone = document.getElementById("clarion-telefone");
  if (telefone) {
    telefone.addEventListener("input", function (e) {
      var value = e.target.value.replace(/\D/g, "").slice(0, 11);
      value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
      value = value.replace(/(\d{5})(\d)/, "$1-$2");
      e.target.value = value;
    });
  }

  form.querySelectorAll(".clarion-form__option-card").forEach(function (card) {
    card.addEventListener("click", function () {
      card.parentElement
        .querySelectorAll(".clarion-form__option-card")
        .forEach(function (c) {
          c.classList.remove("selected");
        });
      card.classList.add("selected");

      var hiddenInput = card
        .closest(".clarion-form__step")
        .querySelector("input[type=hidden]");
      if (hiddenInput) hiddenInput.value = card.dataset.value;

      setTimeout(nextStep, 250);
    });
  });

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    if (!isLastStep()) {
      advanceCurrentStep();
      return;
    }

    var lgpd = document.getElementById("clarion-lgpd");
    if (lgpd && !lgpd.checked) {
      lgpd.reportValidity();
      return;
    }

    var faturamentoVal = document.getElementById("clarion-faturamento").value;
    if (!faturamentoVal) {
      var statusMissing = document.getElementById("clarion-form-status");
      if (statusMissing) {
        statusMissing.classList.add("is-error");
        statusMissing.textContent = "Selecione uma faixa de faturamento.";
      }
      return;
    }

    if (isSubmitting) return;

    var status = document.getElementById("clarion-form-status");
    status.classList.remove("is-error");
    status.textContent = "Enviando...";
    setSubmitting(true);

    var utm = getUtmParams();
    var hpEl = document.getElementById("clarion-form-hp");

    var payload = {
      lp_key: LP_KEY,
      respostas: {
        nome: document.getElementById("clarion-nome").value,
        email: document.getElementById("clarion-email").value,
        telefone: document.getElementById("clarion-telefone").value,
        empresa: document.getElementById("clarion-empresa").value,
        faturamento: faturamentoVal,
      },
      utm_source: utm.utm_source,
      utm_medium: utm.utm_medium || "",
      utm_campaign: utm.utm_campaign || "",
      utm_term: utm.utm_term || "",
      utm_content: utm.utm_content || "",
      page_url: window.location.href,
      referrer: document.referrer || "",
      page_title: document.title,
      _hp: hpEl ? hpEl.value : "",
    };

    try {
      var response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      var data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Erro ao enviar");
      }

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "forge_lead_submit",
        form_slug: FORM_SLUG,
        lp_key: LP_KEY,
        page_path: window.location.pathname,
        utm_source: utm.utm_source,
        utm_medium: utm.utm_medium || "",
        utm_campaign: utm.utm_campaign || "",
        utm_term: utm.utm_term || "",
        utm_content: utm.utm_content || "",
      });

      window.location.assign(buildThankYouUrl());
    } catch (err) {
      setSubmitting(false);
      status.classList.add("is-error");
      status.textContent =
        "Não foi possível enviar o formulário. Tente novamente.";
      console.error(err);
    }
  });

  persistUtmsFromUrl();
  showStep(0);
  updateProgress();
})();
