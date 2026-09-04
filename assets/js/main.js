(function () {
  document.querySelectorAll('a[href="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
    });
  });

  var prevBtn = document.querySelector(
    '.carousel-controls button[aria-label="Depoimento anterior"]',
  );
  var nextBtn = document.querySelector(
    '.carousel-controls button[aria-label="Próximo depoimento"]',
  );
  var quoteEl = document.querySelector("[data-testimonial-quote]");
  var authorEl = document.querySelector("[data-testimonial-author]");

  var testimonials = [
    {
      quote:
        "“O Clarion trouxe mais agilidade e confiança para a análise das informações. Antes, dependíamos de relatórios demorados e de diferentes fontes de dados. Agora, conseguimos fazer perguntas de forma simples, acessar respostas claras e tomar decisões com muito mais rapidez, segurança e autonomia.”",
      authorHtml: "<strong>CR Branding e Marketing</strong>",
    },
    {
      quote:
        "“Confiamos tanto no Clarion que usamos a solução dentro da própria Mosten. Ele nos ajuda a acessar informações com mais rapidez, segurança e clareza, apoiando decisões do dia a dia com dados confiáveis.”",
      authorHtml:
        "<strong>Luiz Freitas</strong><span>, Gerente de Negócios da Mosten</span>",
    },
    {
      quote:
        "“O Clarion mudou a forma como acessamos e usamos nossos dados. Hoje, temos mais autonomia para encontrar respostas, mais confiança nas informações e mais agilidade para tomar decisões importantes.”",
      authorHtml: "<strong>Yotatech Consultoria de Informações</strong>",
    },
  ];

  var currentIndex = 0;

  function renderTestimonial(index) {
    var testimonial = testimonials[index];
    if (!testimonial || !quoteEl || !authorEl) return;
    quoteEl.textContent = testimonial.quote;
    authorEl.innerHTML = testimonial.authorHtml;
    if (prevBtn) prevBtn.disabled = index === 0;
    if (nextBtn) nextBtn.disabled = index === testimonials.length - 1;
  }

  if (prevBtn && nextBtn && quoteEl && authorEl) {
    prevBtn.addEventListener("click", function () {
      if (currentIndex === 0) return;
      currentIndex -= 1;
      renderTestimonial(currentIndex);
    });

    nextBtn.addEventListener("click", function () {
      if (currentIndex === testimonials.length - 1) return;
      currentIndex += 1;
      renderTestimonial(currentIndex);
    });

    renderTestimonial(currentIndex);
  }
})();
