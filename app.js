const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ============================================================
   1. DADOS EDITÁVEIS
   Para adicionar um projeto ou ferramenta, edite só estas listas.
   ============================================================ */
const TOOLS = [
  { name: 'Power BI', icon: 'logo-powerbi.png' },
  { name: 'DAX', icon: 'Dax.png' },
  { name: 'Power Query', icon: 'Query.png' },
  { name: 'SQL', icon: 'logo-sql.png' },
  { name: 'Python', icon: 'logo-python.png' },
  { name: 'Excel', icon: 'logo-excel.png' },
  { name: 'ETL', icon: 'logo-etl.png' },
  { name: 'n8n', icon: 'logo-n8n.png' },
  { name: 'Claude', icon: 'Claude.png' },
  { name: 'ChatGPT', icon: 'chat-gpt.png' }
];

// demo e repo são opcionais: o link só aparece se tiver endereço.
const PROJECTS = [
  {
    title: 'Implantação de Power BI',
    desc: 'Centralizei dados que estavam distribuídos entre Excel, SQL e SharePoint. Modelagem, relacionamentos e medidas DAX reduziram em 80% o tempo de atualização dos relatórios.',
    note: 'Dados alterados para números fictícios.',
    tags: ['Power BI', 'SQL', 'Excel'],
    image: 'Implantação de Power BI.png',
    demo: '',
    repo: ''
  },
  {
    title: 'Automação de processos com n8n',
    desc: 'Fluxos automáticos de atendimento via WhatsApp, processamento de imagens, comunicação interna e integração de sistemas, reduzindo tarefas manuais e padronizando processos.',
    note: '',
    tags: ['n8n', 'Automação'],
    image: 'Automação de Processos com n8n.png',
    demo: '',
    repo: ''
  },
  {
    title: 'Painéis de vendas e estoque',
    desc: 'Reativação e desenvolvimento de dashboards de vendas na Softplan, com medidas DAX, consultas SQL e rotinas em Python, dando visão rápida de desempenho por vendedor e produto.',
    note: 'Dados e logo alterados para números fictícios.',
    tags: ['Power BI', 'DAX', 'SQL', 'Python'],
    image: 'Painéis de Vendas e Estoque.png',
    demo: '',
    repo: ''
  }
];

const OWNER_WHATSAPP = '5561991333574';

/* Escapa texto antes de inserir em HTML */
function esc(str = '') {
  return String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

/* ============================================================
   2. ANO NO RODAPÉ
   ============================================================ */
const yearEl = $('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ============================================================
   3. CABEÇALHO: borda ao rolar + menu mobile + seção ativa
   ============================================================ */
(function header() {
  const headerEl = $('.site-header');
  const toggle = $('.menu-toggle');
  const nav = $('#menu-principal');
  if (!headerEl || !nav) return;

  const onScroll = () => headerEl.classList.toggle('scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function setMenu(open) {
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  }

  if (toggle) {
    toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
    $$('a', nav).forEach((a) => a.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        setMenu(false);
        toggle.focus();
      }
    });
    document.addEventListener('click', (e) => {
      if (nav.classList.contains('open') && !nav.contains(e.target) && !toggle.contains(e.target)) setMenu(false);
    });
  }

  // Destaca no menu a seção que está na tela
  const links = $$('a[href^="#"]', nav);
  const sections = links.map((a) => $(a.getAttribute('href'))).filter(Boolean);
  if (!('IntersectionObserver' in window) || !sections.length) return;

  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((a) => {
        const active = a.getAttribute('href') === '#' + entry.target.id;
        a.classList.toggle('active', active);
        if (active) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  sections.forEach((s) => spy.observe(s));
})();

/* ============================================================
   4. FERRAMENTAS
   ============================================================ */
(function tools() {
  const list = $('#tool-list');
  if (!list) return;

  list.innerHTML = TOOLS.map((t) => `
    <li class="tool">
      <img src="${esc(t.icon)}" alt="" width="20" height="20" loading="lazy" data-initial="${esc(t.name.charAt(0))}">
      <span>${esc(t.name)}</span>
    </li>`).join('');

  // Se o ícone não carregar, mostra a inicial no lugar
  $$('img', list).forEach((img) => {
    img.addEventListener('error', () => {
      const fb = document.createElement('span');
      fb.className = 'tool-fallback';
      fb.setAttribute('aria-hidden', 'true');
      fb.textContent = img.dataset.initial;
      img.replaceWith(fb);
    }, { once: true });
  });
})();

/* ============================================================
   5. PROJETOS
   ============================================================ */
(function projects() {
  const grid = $('#projects-grid');
  if (!grid) return;

  const linkIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"/></svg>';

  grid.innerHTML = PROJECTS.map((p) => {
    const links = [
      p.demo ? `<a href="${esc(p.demo)}" target="_blank" rel="noopener noreferrer">Ver projeto ${linkIcon}</a>` : '',
      p.repo ? `<a href="${esc(p.repo)}" target="_blank" rel="noopener noreferrer">Código no GitHub ${linkIcon}</a>` : ''
    ].join('');

    return `
      <article class="project" data-reveal>
        <button type="button" class="project-thumb" data-full="${esc(p.image)}" data-alt="${esc(p.title)}"
          aria-label="Ampliar imagem do projeto ${esc(p.title)}">
          <img src="${esc(p.image)}" alt="" loading="lazy" decoding="async" width="800" height="500">
          <span class="zoom-hint" aria-hidden="true">
            <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5M11 8v6M8 11h6"/></svg>
            Ampliar
          </span>
        </button>
        <div class="project-body">
          <h3>${esc(p.title)}</h3>
          <p class="project-desc">${esc(p.desc)}</p>
          ${p.note ? `<p class="project-note">${esc(p.note)}</p>` : ''}
          <ul class="project-tags" aria-label="Tecnologias usadas">
            ${p.tags.map((t) => `<li>${esc(t)}</li>`).join('')}
          </ul>
          ${links ? `<div class="project-links">${links}</div>` : ''}
        </div>
      </article>`;
  }).join('');
})();

/* ============================================================
   6. ANIMAÇÃO DE ENTRADA DAS SEÇÕES
   ============================================================ */
(function reveal() {
  const els = $$('[data-reveal]');
  if (!els.length) return;

  if (reduceMotion || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('in'));
    return;
  }

  // Pequeno atraso em cascata para itens irmãos (cards, vagas)
  els.forEach((el) => {
    const siblings = Array.from(el.parentElement.children).filter((c) => c.hasAttribute('data-reveal'));
    const i = siblings.indexOf(el);
    if (i > 0) el.style.setProperty('--reveal-delay', `${Math.min(i, 4) * 80}ms`);
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach((el) => io.observe(el));
})();

/* ============================================================
   7. MODAIS (abrir, fechar, foco preso dentro, Esc)
   ============================================================ */
const Modal = (function () {
  let current = null;
  let lastFocused = null;
  const FOCUSABLE = 'a[href], button:not([disabled]), input, textarea, select, iframe, [tabindex]:not([tabindex="-1"])';

  function open(el) {
    if (!el) return;
    if (current) close();
    lastFocused = document.activeElement;
    current = el;
    el.hidden = false;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => el.classList.add('open'));
    const first = $('.modal-close, .lightbox-close', el) || $(FOCUSABLE, el);
    if (first) first.focus();
  }

  function close() {
    if (!current) return;
    const el = current;
    current = null;
    el.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { el.hidden = true; }, reduceMotion ? 0 : 250);
    if (lastFocused) lastFocused.focus();
  }

  document.addEventListener('keydown', (e) => {
    if (!current) return;
    if (e.key === 'Escape') {
      close();
      return;
    }
    if (e.key === 'Tab') {
      const items = $$(FOCUSABLE, current).filter((n) => n.offsetParent !== null);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  $$('[data-open]').forEach((btn) => btn.addEventListener('click', () => open(document.getElementById(btn.dataset.open))));
  $$('[data-close]').forEach((btn) => btn.addEventListener('click', close));
  $$('.modal').forEach((m) => m.addEventListener('click', (e) => { if (e.target === m) close(); }));

  return { open, close };
})();

/* ============================================================
   8. LIGHTBOX DAS IMAGENS DOS PROJETOS
   ============================================================ */
(function lightbox() {
  const box = $('#lightbox');
  const img = $('#lightbox-img');
  const grid = $('#projects-grid');
  if (!box || !img || !grid) return;

  grid.addEventListener('click', (e) => {
    const thumb = e.target.closest('.project-thumb');
    if (!thumb) return;
    img.src = thumb.dataset.full;
    img.alt = thumb.dataset.alt;
    Modal.open(box);
  });

  box.addEventListener('click', () => Modal.close());
})();

/* ============================================================
   9. LAUDOS: abas, carregamento sob demanda e zoom
   ============================================================ */
(function laudos() {
  const tabs = $$('#modal-laudos .tab');
  const panels = $$('#modal-laudos .tab-panel');
  if (!tabs.length) return;

  function buildViewer(panel) {
    if (panel.dataset.ready) return;
    panel.dataset.ready = '1';
    const src = panel.dataset.doc;
    const url = encodeURI(src);
    let zoom = 1;

    panel.innerHTML = `
      <div class="doc-viewer">
        <div class="doc-toolbar">
          <span class="doc-name">${esc(src)}</span>
          <div class="doc-controls">
            <button type="button" data-zoom="out" aria-label="Diminuir zoom">−</button>
            <output aria-live="polite">100%</output>
            <button type="button" data-zoom="in" aria-label="Aumentar zoom">+</button>
            <a class="btn btn-small" href="${url}" target="_blank" rel="noopener">Abrir em nova aba</a>
            <a class="btn btn-small" href="${url}" download>Baixar PDF</a>
          </div>
        </div>
        <div class="doc-frame">
          <div class="doc-loading"><span>Carregando documento</span></div>
          <iframe src="${url}" title="${esc(src)}"></iframe>
        </div>
      </div>`;

    const frameWrap = $('.doc-frame', panel);
    const frame = $('iframe', panel);
    const out = $('output', panel);

    frame.addEventListener('load', () => frameWrap.classList.add('loaded'), { once: true });
    // Garante que o indicador some mesmo se o navegador não disparar "load" para PDF
    setTimeout(() => frameWrap.classList.add('loaded'), 4000);

    $$('[data-zoom]', panel).forEach((btn) => {
      btn.addEventListener('click', () => {
        zoom = btn.dataset.zoom === 'in' ? Math.min(zoom + 0.2, 2.4) : Math.max(zoom - 0.2, 0.6);
        frame.style.transform = `scale(${zoom})`;
        out.textContent = Math.round(zoom * 100) + '%';
      });
    });
  }

  function select(tab) {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
    });
    panels.forEach((p) => {
      const on = p.id === tab.getAttribute('aria-controls');
      p.hidden = !on;
      if (on) buildViewer(p);
    });
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const next = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
      next.focus();
      select(next);
    });
  });

  // Só carrega os PDFs quando o modal é aberto pela primeira vez
  $$('[data-open="modal-laudos"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const active = tabs.find((t) => t.getAttribute('aria-selected') === 'true') || tabs[0];
      select(active);
    });
  });
})();

/* ============================================================
   10. FORMULÁRIO DE CONTATO → WHATSAPP
   ============================================================ */
(function waForm() {
  const form = $('#wa-form');
  const status = $('#wa-status');
  if (!form) return;

  const setStatus = (msg, type) => {
    status.textContent = msg;
    status.className = type;
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fields = [form.elements.name, form.elements.phone, form.elements.message];
    let firstEmpty = null;

    fields.forEach((f) => {
      const empty = !f.value.trim();
      f.setAttribute('aria-invalid', String(empty));
      if (empty && !firstEmpty) firstEmpty = f;
    });

    if (firstEmpty) {
      setStatus('Preencha nome, WhatsApp e mensagem antes de enviar.', 'err');
      firstEmpty.focus();
      return;
    }

    const [name, phone, message] = fields.map((f) => f.value.trim());
    const text = `Olá, meu nome é ${name}.\nMeu WhatsApp: ${phone}\n\nMensagem:\n${message}`;
    window.open(`https://wa.me/${OWNER_WHATSAPP}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');

    setStatus('Abrindo o WhatsApp com a sua mensagem pronta.', 'ok');
    form.reset();
    fields.forEach((f) => f.removeAttribute('aria-invalid'));
  });

  form.addEventListener('input', (e) => {
    if (e.target.value.trim()) e.target.removeAttribute('aria-invalid');
  });
})();
