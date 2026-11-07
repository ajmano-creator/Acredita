(function () {
  "use strict";

  var DATA = window.ACREDITA_DISTRITOS || [];
  var $ = function (s, ctx) { return (ctx || document).querySelector(s); };
  var $$ = function (s, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(s)); };

  // Normaliza texto para pesquisa sem acentos nem maiúsculas.
  function norm(str) {
    return str.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/gi, " ").toLowerCase().replace(/\s+/g, " ").trim();
  }

  /* ---------- Menu móvel ---------- */
  var toggle = $(".nav-toggle");
  var nav = $("#menu");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("is-open", !open);
    });
    $$("a", nav).forEach(function (a) {
      a.addEventListener("click", function () {
        toggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
      });
    });
  }

  /* ---------- Acessibilidade: tamanho do texto e contraste ---------- */
  var root = document.documentElement;
  var fontStep = parseInt(localStorage.getItem("ae-font") || "0", 10);
  function applyFont() { root.style.fontSize = (100 + fontStep * 10) + "%"; }
  applyFont();
  $$("[data-font]").forEach(function (b) {
    b.addEventListener("click", function () {
      fontStep = Math.max(-1, Math.min(3, fontStep + (b.dataset.font === "up" ? 1 : -1)));
      localStorage.setItem("ae-font", fontStep);
      applyFont();
    });
  });
  var contrast = $("#contrastToggle");
  if (localStorage.getItem("ae-contrast") === "1") {
    root.classList.add("high-contrast");
    contrast.setAttribute("aria-pressed", "true");
  }
  contrast.addEventListener("click", function () {
    var on = root.classList.toggle("high-contrast");
    contrast.setAttribute("aria-pressed", String(on));
    localStorage.setItem("ae-contrast", on ? "1" : "0");
  });

  /* ---------- Distritos ---------- */
  var provincesEl = $("#provinces");
  var allDistricts = [];
  DATA.forEach(function (p) {
    var box = document.createElement("div");
    box.className = "province";
    var h = document.createElement("h3");
    h.innerHTML = p.provincia + ' <span class="province__count">' + p.distritos.length + "</span>";
    var ul = document.createElement("ul");
    p.distritos.forEach(function (d) {
      var li = document.createElement("li");
      li.textContent = d;
      li.dataset.key = norm(d);
      ul.appendChild(li);
      allDistricts.push({ nome: d, provincia: p.provincia, key: norm(d), el: li });
    });
    box.appendChild(h);
    box.appendChild(ul);
    provincesEl.appendChild(box);
  });

  var search = $("#districtSearch");
  var searchResult = $("#districtSearchResult");
  search.addEventListener("input", function () {
    var q = norm(search.value);
    allDistricts.forEach(function (d) { d.el.classList.remove("is-match"); });
    $$(".province").forEach(function (p) { p.classList.remove("is-dim"); });
    if (q.length < 2) { searchResult.textContent = ""; return; }

    var hits = allDistricts.filter(function (d) { return d.key.indexOf(q) !== -1; });
    var provs = {};
    hits.forEach(function (d) { d.el.classList.add("is-match"); provs[d.provincia] = true; });
    $$(".province").forEach(function (p) {
      var name = p.querySelector("h3").firstChild.textContent.trim();
      if (!provs[name]) p.classList.add("is-dim");
    });

    if (hits.length) {
      searchResult.className = "search__result is-ok";
      searchResult.textContent = hits.length === 1
        ? hits[0].nome + " (" + hits[0].provincia + ") está abrangido pelo programa."
        : hits.length + " distritos correspondem à pesquisa.";
    } else {
      searchResult.className = "search__result is-no";
      searchResult.textContent = "Nenhum distrito abrangido corresponde a «" + search.value + "». Confirme a grafia ou contacte o INJ.";
    }
  });

  /* ---------- Verificador de elegibilidade ---------- */
  var sel = $("#c-district");
  DATA.forEach(function (p) {
    var group = document.createElement("optgroup");
    group.label = p.provincia;
    p.distritos.forEach(function (d) {
      var o = document.createElement("option");
      o.value = d; o.textContent = d;
      group.appendChild(o);
    });
    sel.insertBefore(group, sel.lastElementChild);
  });

  var checker = $("#checker");
  var out = $("#checkerResult");
  checker.addEventListener("submit", function (e) {
    e.preventDefault();
    var f = checker.elements;
    var age = parseInt(f.age.value, 10);
    var school = checker.querySelector("[name=school]:checked");
    var work = checker.querySelector("[name=work]:checked");
    var prev = checker.querySelector("[name=prev]:checked");

    if (!age || !f.district.value || !school || !work || !prev) {
      out.className = "checker__result is-warn";
      out.textContent = "Responda a todas as perguntas para ver o resultado.";
      return;
    }
    var fails = [];
    if (age < 18 || age > 35) fails.push("A idade tem de estar entre 18 e 35 anos.");
    if (f.district.value === "__outro") fails.push("O distrito de residência não está entre os 78 abrangidos.");
    if (school.value !== "sim") fails.push("É exigida, no mínimo, a 5.ª classe.");
    if (work.value !== "ok") fails.push("O programa destina-se a jovens desempregados, subempregados ou no sector informal.");
    if (prev.value === "sim") fails.push("Os beneficiários da edição anterior não são elegíveis.");

    out.innerHTML = "";
    var title = document.createElement("strong");
    if (fails.length === 0) {
      out.className = "checker__result is-ok";
      title.textContent = "Cumpre os critérios principais.";
      out.appendChild(title);
      var p = document.createElement("p");
      p.textContent = "Guarde a declaração do bairro ou outro comprovativo de residência. As candidaturas de 2026 já encerraram: subscreva os avisos para saber da próxima edição.";
      out.appendChild(p);
    } else {
      out.className = "checker__result is-no";
      title.textContent = "Não cumpre todos os critérios:";
      out.appendChild(title);
      var ul = document.createElement("ul");
      fails.forEach(function (t) { var li = document.createElement("li"); li.textContent = t; ul.appendChild(li); });
      out.appendChild(ul);
    }
  });

  /* ---------- FAQ: filtros por categoria ---------- */
  var tabs = $$(".faq-tabs [role=tab]");
  tabs.forEach(function (t) {
    t.addEventListener("click", function () {
      tabs.forEach(function (x) { x.setAttribute("aria-selected", String(x === t)); });
      var cat = t.dataset.cat;
      $$("#faqList details").forEach(function (d) {
        d.hidden = !(cat === "all" || d.dataset.cat === cat);
      });
    });
  });

  /* ---------- Formulários ----------
     Sem servidor ligado: validam no navegador e mostram uma mensagem.
     Para produção, definir data-endpoint no <form> com o URL da API do MJD. */
  function wireForm(form, okMsg, validate) {
    var msg = $(".form-msg", form);
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var err = validate(form);
      if (err) { msg.className = "form-msg is-no"; msg.textContent = err; return; }
      var endpoint = form.dataset.endpoint;
      if (!endpoint) {
        msg.className = "form-msg is-ok";
        msg.textContent = okMsg;
        form.reset();
        form.dispatchEvent(new Event("change"));
        return;
      }
      fetch(endpoint, { method: "POST", body: new FormData(form) })
        .then(function (r) { if (!r.ok) throw new Error(); msg.className = "form-msg is-ok"; msg.textContent = okMsg; form.reset(); })
        .catch(function () { msg.className = "form-msg is-no"; msg.textContent = "Não foi possível enviar. Tente mais tarde."; });
    });
  }

  var sub = $("#subscribeForm");
  function canalVal() { var c = sub.querySelector("[name=canal]:checked"); return c ? c.value : "sms"; }
  function syncCanal() {
    $$("[data-show]", sub).forEach(function (el) { el.hidden = el.dataset.show !== canalVal(); });
  }
  sub.addEventListener("change", syncCanal);
  syncCanal();

  wireForm(sub, "Subscrição registada. Obrigado.", function (f) {
    if (canalVal() === "sms") {
      var tel = f.telefone.value.trim();
      if (!/^(\+?258)?\s?8[2-7]\s?\d{3}\s?\d{4}$/.test(tel)) return "Indique um número móvel válido, por exemplo 84 123 4567.";
    } else if (!f.email.value || !f.email.checkValidity()) {
      return "Indique um endereço de e-mail válido.";
    }
    if (!f.consent.checked) return "É necessário aceitar receber comunicações.";
    return "";
  });

  wireForm($("#feedbackForm"), "Mensagem recebida. Obrigado pela sua participação.", function (f) {
    if (!f.nome.value.trim() || !f.contacto.value.trim() || !f.assunto.value || !f.mensagem.value.trim()) {
      return "Preencha todos os campos.";
    }
    return "";
  });

  /* ---------- Animação dos números ---------- */
  var fmt = function (n) { return n.toLocaleString("pt-PT").replace(/\./g, " ").replace(/ | /g, " "); };
  var stats = $$("[data-count]");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target, end = +el.dataset.count, t0 = null;
        io.unobserve(el);
        (function tick(ts) {
          t0 = t0 || ts;
          var k = Math.min(1, (ts - t0) / 1200);
          el.textContent = fmt(Math.round(end * (1 - Math.pow(1 - k, 3))));
          if (k < 1) requestAnimationFrame(tick);
        })(performance.now());
      });
    }, { threshold: 0.4 });
    stats.forEach(function (s) { io.observe(s); });
  }

  /* ---------- Submenu "Sobre" ---------- */
  $$(".sub-toggle").forEach(function (b) {
    var li = b.parentElement;
    function close() { b.setAttribute("aria-expanded", "false"); li.classList.remove("is-open"); }
    b.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = b.getAttribute("aria-expanded") === "true";
      b.setAttribute("aria-expanded", String(!open));
      li.classList.toggle("is-open", !open);
    });
    document.addEventListener("click", function (e) { if (!li.contains(e.target)) close(); });
    li.addEventListener("keydown", function (e) { if (e.key === "Escape") { close(); b.focus(); } });
  });

  /* ---------- Cartazes ampliados ---------- */
  var lb = $("#lightbox");
  if (lb && lb.showModal) {
    var lbImg = $("img", lb);
    $$(".news__img").forEach(function (b) {
      b.addEventListener("click", function () {
        lbImg.src = b.dataset.full;
        lbImg.alt = b.querySelector("img").alt;
        lb.showModal();
      });
    });
    $(".lightbox__close", lb).addEventListener("click", function () { lb.close(); });
    lb.addEventListener("click", function (e) { if (e.target === lb) lb.close(); });
  }

  /* ---------- Próximos passos: separadores ---------- */
  var ppTabs = $$(".pp-tabs [role=tab]");
  function selectPP(tab, focus) {
    ppTabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
    });
    if (focus) tab.focus();
  }
  ppTabs.forEach(function (t, i) {
    t.addEventListener("click", function () { selectPP(t); });
    t.addEventListener("keydown", function (e) {
      var k = e.key, n = ppTabs.length;
      if (k === "ArrowRight" || k === "ArrowDown") { e.preventDefault(); selectPP(ppTabs[(i + 1) % n], true); }
      if (k === "ArrowLeft" || k === "ArrowUp") { e.preventDefault(); selectPP(ppTabs[(i - 1 + n) % n], true); }
      if (k === "Home") { e.preventDefault(); selectPP(ppTabs[0], true); }
      if (k === "End") { e.preventDefault(); selectPP(ppTabs[n - 1], true); }
    });
  });

  /* ---------- Botão voltar ao topo ---------- */
  var toTop = $(".to-top");
  window.addEventListener("scroll", function () {
    toTop.classList.toggle("is-visible", window.scrollY > 700);
  }, { passive: true });

  /* ---------- Menu: ligação activa conforme a secção visível ---------- */
  var navLinks = $$('#menu a[href^="#"]');
  var byId = {};
  navLinks.forEach(function (a) { var id = a.getAttribute("href").slice(1); if (id) (byId[id] = byId[id] || []).push(a); });
  var sections = Object.keys(byId).map(function (id) { return document.getElementById(id); }).filter(Boolean);
  if ("IntersectionObserver" in window) {
    var navIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        navLinks.forEach(function (a) { a.classList.remove("is-active"); });
        $$(".has-sub").forEach(function (li) { li.classList.remove("is-current"); });
        (byId[en.target.id] || []).forEach(function (a) {
          a.classList.add("is-active");
          var sub = a.closest(".has-sub");
          if (sub) sub.classList.add("is-current");
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { navIO.observe(s); });
  }

  /* ---------- Aparecimento suave ---------- */
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    root.classList.add("js");
    var revealEls = $$(".card, .req, .steps li, .news__item, .contact, .quick__item, .next-edition, .timeline li");
    revealEls.forEach(function (el) { el.classList.add("reveal"); });
    var revIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        el.classList.add("is-in");
        revIO.unobserve(el);
        setTimeout(function () { el.classList.remove("reveal", "is-in"); }, 700);
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { revIO.observe(el); });
  }

  $("#year").textContent = new Date().getFullYear();
})();
