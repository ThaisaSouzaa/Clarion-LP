(function () {
  var LP_KEY = "lp-clarion-campanha";
  var FORM_SLUG = "campanha_meta_ads_l_carion";
  var ORIGEM_FALLBACK = "LP Clarion Campanha - mosten.com/clarionads";
  var UTM_KEYS = [
    "utm_campaign",
    "utm_source",
    "utm_content",
    "utm_medium",
    "utm_term",
  ];

  var modal = document.getElementById("clarion-form-modal");
  var openTriggers = document.querySelectorAll(".js-open-form-modal");
  var closeTriggers = document.querySelectorAll("[data-close-modal]");
  var lastFocusedElement = null;

  if (!modal || !openTriggers.length) return;

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

  function pushModalOpenEvent() {
    var utm = getUtmParams();
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "forge_form_modal_open",
      form_slug: FORM_SLUG,
      lp_key: LP_KEY,
      page_path: window.location.pathname,
      utm_source: utm.utm_source,
      utm_medium: utm.utm_medium || "",
      utm_campaign: utm.utm_campaign || "",
      utm_term: utm.utm_term || "",
      utm_content: utm.utm_content || "",
    });
  }

  function getFocusableElements() {
    return modal.querySelectorAll(
      'button:not([disabled]), input:not([type="hidden"]):not([disabled]), [href], select, textarea, [tabindex]:not([tabindex="-1"])',
    );
  }

  function openModal(trigger) {
    lastFocusedElement = trigger || document.activeElement;

    if (typeof window.clarionResetForm === "function") {
      window.clarionResetForm();
    }

    modal.removeAttribute("hidden");
    modal.setAttribute("aria-hidden", "false");
    modal.classList.add("is-open");
    document.body.style.overflow = "hidden";
    pushModalOpenEvent();

    var closeBtn = modal.querySelector(".clarion-modal__close");
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    modal.setAttribute("aria-hidden", "true");
    modal.classList.remove("is-open");
    modal.setAttribute("hidden", "");
    document.body.style.overflow = "";

    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus();
    }
  }

  function handleFocusTrap(e) {
    if (e.key !== "Tab" || modal.getAttribute("aria-hidden") === "true") return;

    var focusable = getFocusableElements();
    if (!focusable.length) return;

    var first = focusable[0];
    var last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  openTriggers.forEach(function (trigger) {
    trigger.addEventListener("click", function (e) {
      e.preventDefault();
      openModal(trigger);
    });
  });

  closeTriggers.forEach(function (trigger) {
    trigger.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.getAttribute("aria-hidden") === "false") {
      closeModal();
    }
    handleFocusTrap(e);
  });

  persistUtmsFromUrl();
})();
