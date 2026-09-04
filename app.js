/* ============================================================
   0. UTILS
   ============================================================ */
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

/* ============================================================
   1. PARTICLE MESH BACKGROUND (canvas)
   ============================================================ */
(function particles() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let w, h, dpr, points = [];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.width = window.innerWidth * dpr;
    h = canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';

    const count = Math.min(90, Math.floor((window.innerWidth * window.innerHeight) / 18000));
    points = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35 * dpr,
      vy: (Math.random() - 0.5) * 0.35 * dpr,
      r: (Math.random() * 1.4 + 0.6) * dpr
    }));
  }

  function step() {
    ctx.clearRect(0, 0, w, h);
    const linkDist = 150 * dpr;

    for (const p of points) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
    }

    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const a = points[i];
        const b = points[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < linkDist) {
          const alpha = (1 - dist / linkDist) * 0.35;
          ctx.strokeStyle = `rgba(103,232,249,${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    for (const p of points) {
      ctx.beginPath();
      ctx.fillStyle = 'rgba(168,85,247,0.85)';
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    if (!reduceMotion) requestAnimationFrame(step);
  }

  window.addEventListener('resize', resize);
  resize();
  step();

  if (reduceMotion) {
    step();
  }
})();

/* ============================================================
   2. FADE-UP REVEAL ON SCROLL (Global)
   ============================================================ */
window.initScrollReveal = function(elementsToObserve) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  const els = elementsToObserve || document.querySelectorAll('.reveal');
  els.forEach((el) => {
    el.classList.add('reveal');
    io.observe(el);
  });
};

// Inicializa para os elementos já estáticos do HTML
window.initScrollReveal();

/* ============================================================
   3. TECH MARQUEE — build + duplicate for seamless loop
   ============================================================ */
(function marquee() {
  const techs = [
    { n: 'Power BI', c: '#F2C811', png: 'logo-powerbi.png' },
    { n: 'Python', c: '#3776AB', png: 'logo-python.png' },
    { n: 'SQL', c: '#00B4D8', png: 'logo-sql.png' },
    { n: 'Excel', c: '#21A366', png: 'logo-excel.png' },
    { n: 'DAX', c: '#F2C811', png: 'Dax.png' },
    { n: 'ETL', c: '#67E8F9', png: 'logo-etl.png' },
    { n: 'Claude', c: '#D97757', ai: true, png: 'Claude.png' },
    { n: 'ChatGPT', c: '#10A37F', ai: true, png: 'chat-gpt.png' },
    { n: 'Power Query', c: '#F2C811', png: 'Query.png' },
    { n: 'n8n', c: '#EA4B71', png: 'logo-n8n.png' }
  ];

  const track = document.getElementById('marquee-track');
  if (!track) return;

  window.__techImgFallback = function (img, ai, color) {
    const shape = ai
      ? '<circle cx="12" cy="12" r="9"/><path d="M9 12h6M12 9v6"/>'
      : '<rect x="4" y="4" width="16" height="16" rx="4"/><path d="M8 12h8M8 8h5M8 16h5"/>';

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'ic');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', color);
    svg.setAttribute('stroke-width', '2');
    svg.innerHTML = shape;
    img.replaceWith(svg);
  };

  const chip = (t) => `
    <div class="tech-chip ${t.ai ? 'ai-chip' : ''}">
      <img class="ic-img" src="${t.png}" alt=""
        onerror="window.__techImgFallback(this, ${!!t.ai}, '${t.c}')">
      <span>${t.n}</span>
    </div>`;

  const html = techs.map(chip).join('');
  track.innerHTML = html + html;
})();

/* ============================================================
   4. PROJECT CARDS — build + 3D tilt on hover
   ============================================================ */
(function projects() {
  const data = [
    {
      tag: ['Power BI', 'SQL', 'Excel'],
      title: 'Implantação de Power BI',
      desc: 'Centralizei dados que estavam distribuídos entre Excel, SQL e SharePoint. Modelagem, relacionamentos e medidas DAX reduziram em 80% o tempo de atualização dos relatórios.<br><span class="obs-text">Obs: Dados alterados para números fictícios.</span>',
      image: 'Implantação de Power BI.png'
    },
    {
      tag: ['n8n', 'Automação'],
      title: 'Automação de Processos com n8n',
      desc: 'Fluxos automáticos de atendimento via WhatsApp, processamento de imagens, comunicação interna e integração de sistemas, reduzindo tarefas manuais e padronizando processos.',
      image: 'Automação de Processos com n8n.png'
    },
    {
      tag: ['Power BI', 'DAX', 'SQL', 'Python'],
      title: 'Painéis de Vendas e Estoque',
      desc: 'Reativação e desenvolvimento de dashboards de vendas na Softplan, com medidas DAX, consultas SQL e rotinas em Python — visão rápida de desempenho por vendedor e produto. <br><span class="obs-text">Obs: Dados e logo foram alterados para números fictícios.</span>',
      image: 'Painéis de Vendas e Estoque.png'
    }
  ];

  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  grid.innerHTML = data.map((p) => `
    <article class="proj-card glass reveal">
      <div class="proj-thumb">
        <img src="${p.image}" alt="${p.title}" class="proj-img" />
      </div>
      <div class="proj-body">
        <div class="proj-tags">${p.tag.map((t) => `<span>${t}</span>`).join('')}</div>
        <h3>${p.title}</h3>
        <p>${p.desc}</p>
        <div class="proj-links">
          <a href="#"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 3h7v7M10 14L21 3M21 14v7H3V3h7"/></svg>Ver demo</a>
          <a href="#"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.9a3.3 3.3 0 0 0-1-2.5c3 0 6-2 6-5.5.1-1.3-.4-2.6-1.3-3.5.4-1.2.4-2.5 0-3.5 0 0-1 0-3 1.2a11 11 0 0 0-6 0C8 2 7 2 7 2c-.4 1-.4 2.3 0 3.5A5.4 5.4 0 0 0 5.7 9c0 3.5 3 5.5 6 5.5-.4.4-.7.9-.8 1.4-.2.5-.3 1.1-.2 1.6v3.9"/></svg>Ver detalhes</a>
        </div>
      </div>
    </article>`).join('');

  const newCards = grid.querySelectorAll('.proj-card');
  if (window.initScrollReveal) {
    window.initScrollReveal(newCards);
  }

  // --- LÓGICA PARA AMPLIAR A IMAGEM (LIGHTBOX) ---
  const lightbox = document.getElementById('img-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');

  if (lightbox && lightboxImg) {
    // Clique na imagem do card
    grid.querySelectorAll('.proj-img').forEach((img) => {
      img.addEventListener('click', (e) => {
        e.stopPropagation(); // Evita conflitos com outros eventos
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('active');
      });
    });

    // Fechar ao clicar no fundo preto ou no 'X'
    lightbox.addEventListener('click', () => {
      lightbox.classList.remove('active');
    });

    // Fechar com a tecla ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') lightbox.classList.remove('active');
    });
  }

  // Tilt effect (desktop only)
  if (window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
    newCards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(700px) rotateX(${(-py * 7).toFixed(2)}deg) rotateY(${(px * 7).toFixed(2)}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }
})();

/* ============================================================
   5. MODALS (open/close, focus trap básico, esc to close)
   ============================================================ */
(function modals() {
  const openers = document.querySelectorAll('[data-open]');
  const closers = document.querySelectorAll('[data-close]');
  let lastFocused = null;

  function open(id) {
    const m = document.getElementById(id);
    if (!m) return;
    lastFocused = document.activeElement;
    m.classList.add('open');
    document.body.style.overflow = 'hidden';

    const closeBtn = m.querySelector('.modal-close');
    if (closeBtn) closeBtn.focus();
  }

  function closeAll() {
    document.querySelectorAll('.modal-overlay.open').forEach((m) => m.classList.remove('open'));
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  openers.forEach((btn) => btn.addEventListener('click', () => open(btn.dataset.open)));
  closers.forEach((btn) => btn.addEventListener('click', closeAll));

  document.querySelectorAll('.modal-overlay').forEach((ov) => {
    ov.addEventListener('click', (e) => {
      if (e.target === ov) closeAll();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAll();
  });
})();

/* ============================================================
   6. LAUDOS: TABS + DOC VIEWER + ZOOM
   ============================================================ */
(function laudos() {
  const tabs = document.querySelectorAll('#laudo-tabs .tab-btn');
  const panels = document.querySelectorAll('.tab-panel');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      panels.forEach((p) => p.classList.remove('active'));
      tab.classList.add('active');
      const targetPanel = document.getElementById(tab.dataset.tab);
      if (targetPanel) targetPanel.classList.add('active');
    });
  });

  panels.forEach((panel, idx) => {
    const src = panel.dataset.doc;
    if (!src) return;
    let zoom = 1;

    panel.innerHTML = `
      <div class="doc-viewer">
        <div class="doc-toolbar">
          <span class="mono" style="font-size:.78rem;color:var(--text-dim);">${src.split('/').pop()}</span>
          <div class="zoom-controls">
            <button data-zoom="out" aria-label="Diminuir zoom">−</button>
            <span data-zoom-val>100%</span>
            <button data-zoom="in" aria-label="Aumentar zoom">+</button>
            <a class="btn" style="padding:8px 14px;" href="${src}" download>Baixar PDF</a>
          </div>
        </div>
        <div class="doc-frame-wrap">
          <iframe src="${src}" title="Laudo médico ${idx + 1}" loading="lazy"
            onerror="this.parentElement.innerHTML='<div class=doc-fallback>Não foi possível carregar o PDF. Verifique se o arquivo existe em <code>${src}</code>.</div>'"></iframe>
        </div>
      </div>`;

    const frame = panel.querySelector('iframe');
    const valEl = panel.querySelector('[data-zoom-val]');

    panel.querySelectorAll('[data-zoom]').forEach((btn) => {
      btn.addEventListener('click', () => {
        zoom = btn.dataset.zoom === 'in' ? Math.min(zoom + 0.2, 2.4) : Math.max(zoom - 0.2, 0.5);
        if (frame) frame.style.transform = `scale(${zoom})`;
        if (valEl) valEl.textContent = Math.round(zoom * 100) + '%';
      });
    });
  });
})();

/* ============================================================
   7. FORMULÁRIO DE CONTATO → WHATSAPP
   ============================================================ */
(function waForm() {
  const OWNER_WHATSAPP = '5561991333574';

  const form = document.getElementById('wa-form');
  const status = document.getElementById('wa-status');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const phone = form.phone.value.trim();
    const message = form.message.value.trim();

    if (!name || !phone || !message) {
      if (status) {
        status.textContent = 'Preencha nome, WhatsApp e mensagem antes de enviar.';
        status.className = 'err';
      }
      return;
    }

    const text =
      `Olá, meu nome é ${name}.
Meu WhatsApp: ${phone}

Mensagem:
${message}`;

    const url = `https://wa.me/${OWNER_WHATSAPP}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener');

    if (status) {
      status.textContent = 'Abrindo o WhatsApp com sua mensagem pronta...';
      status.className = 'ok';
    }
    form.reset();
  });
})();