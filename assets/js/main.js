(() => {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const store = {
    get(key) { try { return sessionStorage.getItem(key); } catch (e) { return null; } },
    set(key, value) { try { sessionStorage.setItem(key, value); } catch (e) { /* modo privado */ } }
  };
  // O idioma fica salvo entre visitas; o resto (intro, perfil) vale só para a sessão
  const prefs = {
    get(key) { try { return localStorage.getItem(key); } catch (e) { return null; } },
    set(key, value) { try { localStorage.setItem(key, value); } catch (e) { /* modo privado */ } }
  };

  const escapeHTML = (str) => String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---------------------------------------------------------
     Idioma
     --------------------------------------------------------- */
  const LANGS = ['pt', 'en'];

  function initialLang() {
    // Prioridade: ?lang= no link, depois a escolha salva, depois o idioma do navegador
    const fromUrl = new URLSearchParams(location.search).get('lang');
    if (LANGS.includes(fromUrl)) return fromUrl;
    const saved = prefs.get('ph-lang');
    if (LANGS.includes(saved)) return saved;
    return (navigator.language || 'pt').toLowerCase().startsWith('pt') ? 'pt' : 'en';
  }

  let lang = initialLang();

  // Resolve um campo do data.js que pode ser texto simples ou { pt, en }
  const tr = (value) => (value && typeof value === 'object' && !Array.isArray(value) && ('pt' in value || 'en' in value))
    ? (value[lang] !== undefined ? value[lang] : value.pt)
    : value;
  const trList = (value) => (tr(value) || []).map(tr);

  // Texto da interface (i18n.js), com {variáveis}
  function t(key, vars = {}) {
    const text = STRINGS[lang][key] !== undefined ? STRINGS[lang][key] : STRINGS.pt[key];
    if (typeof text !== 'string') return text;
    return text.replace(/\{(\w+)\}/g, (_, name) => (vars[name] !== undefined ? vars[name] : ''));
  }

  /* ---------------------------------------------------------
     Ícones
     --------------------------------------------------------- */
  const ICONS = {
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l12-7.5z"/></svg>',
    plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 4h2v16h-2zM4 11h16v2H4z"/></svg>',
    py: '<svg viewBox="0 0 48 48"><path d="M24 6c-8 0-8 3.5-8 6v4h8v2H12c-4 0-6 3-6 7s2 7 6 7h3v-5c0-3 2-5 5-5h9c3 0 5-2 5-5v-5c0-3-3-6-10-6Z"/><path d="M24 42c8 0 8-3.5 8-6v-4h-8v-2h12c4 0 6-3 6-7s-2-7-6-7h-3v5c0 3-2 5-5 5h-9c-3 0-5 2-5 5v5c0 3 3 6 10 6Z"/><circle cx="20" cy="11" r="1.2"/><circle cx="28" cy="37" r="1.2"/></svg>',
    linux: '<svg viewBox="0 0 48 48"><rect x="5" y="9" width="38" height="30" rx="3"/><path d="m12 19 6 5-6 5M22 30h12"/></svg>',
    net: '<svg viewBox="0 0 48 48"><circle cx="24" cy="10" r="4"/><circle cx="10" cy="36" r="4"/><circle cx="38" cy="36" r="4"/><circle cx="24" cy="26" r="3"/><path d="M24 14v9M21.5 28 13 33.5M26.5 28l8.5 5.5M14 36h20"/></svg>',
    cisco: '<svg viewBox="0 0 48 48"><rect x="5" y="20" width="38" height="12" rx="2"/><path d="M11 26h2M17 26h2M23 26h2M35 24v4M39 24v4M14 20v-6M24 20v-9M34 20v-6"/></svg>',
    shield: '<svg viewBox="0 0 48 48"><path d="M24 5 8 11v11c0 10 7 18 16 21 9-3 16-11 16-21V11Z"/><path d="m17 24 5 5 9-10"/></svg>',
    code: '<svg viewBox="0 0 48 48"><path d="M16 14 6 24l10 10M32 14l10 10-10 10M27 9l-6 30"/></svg>'
  };

  // Arte dos pôsteres de rede: uma topologia simples desenhada em SVG
  const NET_ART = '<svg class="poster__art" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><g stroke="rgba(0,255,136,.35)" stroke-width="1.2" fill="none"><path d="M230 40 L280 80 L230 120 L180 80 Z M230 40 L230 120 M180 80 L280 80 M280 80 L310 140 M180 80 L150 140"/></g><g fill="#00ff88"><circle cx="230" cy="40" r="4"/><circle cx="280" cy="80" r="4"/><circle cx="230" cy="120" r="4"/><circle cx="180" cy="80" r="4"/><circle cx="310" cy="140" r="3" opacity=".6"/><circle cx="150" cy="140" r="3" opacity=".6"/></g></svg>';

  /* ---------------------------------------------------------
     Cards e pôsteres
     --------------------------------------------------------- */
  function posterHTML(item, { large = false } = {}) {
    const lines = trList(item.code);
    const code = lines.length ? `<pre class="poster__code" aria-hidden="true">${escapeHTML(lines.join('\n'))}</pre>` : '';
    const art = item.image
      ? `<img class="poster__art poster__img" src="${escapeHTML(item.image)}" alt="" loading="lazy">`
      : item.art === 'net' ? NET_ART : '';
    const soon = item.art === 'soon'
      ? `<span class="badge-soon">${t('badge.soon')}</span>`
      : item.version ? `<span class="badge-soon badge-soon--version">${t('badge.dev', { v: escapeHTML(item.version) })}</span>` : '';
    const TitleTag = large ? 'h2' : 'h3';
    const titleId = large ? ' id="modal-title"' : '';
    return `
      <div class="poster poster--${item.art}">
        ${art}${code}${soon}
        <span class="poster__mark"><span class="brand__mark">PH</span></span>
        ${item.short ? `<span class="poster__short" aria-hidden="true">${escapeHTML(item.short)}</span>` : ''}
        <${TitleTag} class="poster__title"${titleId}>${escapeHTML(tr(item.title))}</${TitleTag}>
      </div>`;
  }

  const tagsHTML = (tags) => `<ul class="tags" role="list">${trList(tags).map((tag) => `<li>${escapeHTML(tag)}</li>`).join('')}</ul>`;

  function cardHTML(item, group) {
    const primary = (item.links || []).find((l) => l.primary);
    const playLabel = group === 'projects' ? 'GitHub' : t('card.credential');
    const playBtn = item.video
      ? `<button class="icon-btn icon-btn--solid" type="button" data-play>${ICONS.play}${t('card.watchDemo')}</button>`
      : primary
        ? `<a class="icon-btn icon-btn--solid" href="${escapeHTML(primary.href)}" target="_blank" rel="noopener" data-stop>${ICONS.play}${playLabel}</a>`
        : '';
    const meta = [
      item.match ? `<span class="match">${t('match', { n: item.match })}</span>` : '',
      `<span>${escapeHTML(tr(item.year))}</span>`,
      `<span>${escapeHTML(tr(item.kind))}</span>`
    ].join('');

    return `
      <li>
        <article class="card" tabindex="0" data-id="${item.id}" aria-label="${escapeHTML(t('card.open', { x: tr(item.title) }))}">
          ${posterHTML(item)}
          <div class="card__info">
            <div class="card__buttons">
              ${playBtn}
              <button class="icon-btn" type="button" data-details>${ICONS.plus}${t('card.details')}</button>
            </div>
            <div class="card__meta">${meta}</div>
            <p class="card__blurb">${escapeHTML(tr(item.blurb))}</p>
            ${tagsHTML(item.tags)}
          </div>
        </article>
      </li>`;
  }

  function skillCardHTML(skill) {
    const title = tr(skill.title);
    const episode = t('skill.episode', { n: skill.episode });
    return `
      <li>
        <article class="card skill" tabindex="0" data-id="${skill.id}" aria-label="${escapeHTML(t('card.open', { x: `${title}, ${t('skill.watched', { n: skill.level })}` }))}">
          <div class="poster">
            ${skill.image ? `<img class="poster__art poster__img" src="${escapeHTML(skill.image)}" alt="" loading="lazy">` : ''}
            <span class="skill__episode">${episode}</span>
            <span class="skill__icon" aria-hidden="true">${ICONS[skill.icon] || ''}</span>
            <h3 class="poster__title">${escapeHTML(title)}</h3>
            <div class="progress" role="progressbar" aria-label="${escapeHTML(t('skill.mastery', { x: title }))}" aria-valuenow="${skill.level}" aria-valuemin="0" aria-valuemax="100"><span style="width:${skill.level}%"></span></div>
          </div>
          <div class="card__info">
            <div class="card__buttons">
              <button class="icon-btn icon-btn--solid" type="button" data-details>${ICONS.plus}${t('card.details')}</button>
            </div>
            <div class="card__meta"><span class="match">${t('skill.watched', { n: skill.level })}</span><span>${episode}</span></div>
            <p class="card__blurb">${escapeHTML(tr(skill.blurb))}</p>
            ${tagsHTML(skill.tags)}
          </div>
        </article>
      </li>`;
  }

  const ALL = new Map();
  Object.entries(CATALOG).forEach(([group, items]) => items.forEach((item) => ALL.set(item.id, { ...item, group })));

  function renderRows() {
    $$('[data-list]').forEach((track) => {
      const group = track.dataset.list;
      track.innerHTML = CATALOG[group]
        .map((item) => (group === 'skills' ? skillCardHTML(item) : cardHTML(item, group)))
        .join('');
      track.dispatchEvent(new Event('scroll'));
    });

    // Elenco da seção "Sobre" = habilidades
    $('#cast').innerHTML = CATALOG.skills
      .map((s) => `
        <li class="cast__item">
          <span class="cast__face" aria-hidden="true">${ICONS[s.icon] || ''}</span>
          <span><span class="cast__name">${escapeHTML(tr(s.title))}</span><span class="cast__role">${escapeHTML(trList(s.tags)[0])}</span></span>
        </li>`)
      .join('');
  }

  /* ---------------------------------------------------------
     Carrosséis
     --------------------------------------------------------- */
  $$('.row__viewport').forEach((viewport) => {
    const track = $('.row__track', viewport);
    const prev = $('.row__arrow--prev', viewport);
    const next = $('.row__arrow--next', viewport);

    const update = () => {
      const max = track.scrollWidth - track.clientWidth;
      prev.hidden = track.scrollLeft <= 4;
      next.hidden = track.scrollLeft >= max - 4;
    };
    const page = (dir) => track.scrollBy({ left: dir * track.clientWidth * 0.85, behavior: reduceMotion ? 'auto' : 'smooth' });

    prev.addEventListener('click', () => page(-1));
    next.addEventListener('click', () => page(1));
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
  });

  /* ---------------------------------------------------------
     Modal "página do episódio"
     --------------------------------------------------------- */
  const modal = $('#modal');
  const modalContent = $('#modal-content');
  let lastFocus = null;

  function openModal(html) {
    lastFocus = document.activeElement;
    modalContent.innerHTML = `<button class="modal__close" type="button" aria-label="${t('modal.close')}" data-close>×</button>${html}`;
    modal.showModal();
    modal.scrollTop = 0;
    document.body.classList.add('is-locked');
  }

  function closeModal() {
    if (modal.open) modal.close();
  }

  modal.addEventListener('close', () => {
    document.body.classList.remove('is-locked');
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  });
  modal.addEventListener('click', (e) => {
    // Clique no fundo (fora do conteúdo) fecha
    if (e.target === modal || e.target.closest('[data-close]')) closeModal();
  });

  const listHTML = (items) => `<ol class="learned">${items.map((l) => `<li>${escapeHTML(l)}</li>`).join('')}</ol>`;

  function episodeHTML(item) {
    if (item.group === 'skills') return skillModalHTML(item);

    const primary = (item.links || []).find((l) => l.primary);
    const others = (item.links || []).filter((l) => !l.primary);
    const playLabel = item.group === 'projects' ? 'GitHub' : t('card.credential');
    const learnedItems = trList(item.learned);
    const learned = learnedItems.length
      ? `<h3 class="modal__h">${t('modal.learned')}</h3>${listHTML(learnedItems)}`
      : `<p class="modal__synopsis">${t('modal.soon')}</p>`;
    const lines = trList(item.code);
    const code = lines.length ? `<pre class="modal__term">${escapeHTML(lines.join('\n'))}</pre>` : '';
    const video = item.video
      ? `<h3 class="modal__h">${t('modal.demo')}</h3><video class="modal__video" controls preload="metadata" playsinline src="${escapeHTML(item.video)}">${t('modal.noVideo')}</video>`
      : '';
    const roadmap = trList(item.roadmap);
    const versionNote = item.version
      ? `<div class="version-note">
          <p>${t('modal.version', { v: escapeHTML(item.version) })}</p>
          ${roadmap.length ? `<p class="version-note__label">${t('modal.roadmap')}</p><ul>${roadmap.map((r) => `<li>${escapeHTML(r)}</li>`).join('')}</ul>` : ''}
        </div>`
      : '';
    const gallery = item.images && item.images.length
      ? `<h3 class="modal__h">${t('modal.gallery')}</h3><div class="gallery">${item.images.map((img) => `
          <figure class="gallery__item">
            <a href="${escapeHTML(img.src)}" target="_blank" rel="noopener" aria-label="${escapeHTML(t('modal.openImage', { x: tr(img.caption) }))}">
              <img src="${escapeHTML(img.src)}" alt="${escapeHTML(tr(img.alt))}" loading="lazy">
            </a>
            <figcaption>${escapeHTML(tr(img.caption))}</figcaption>
          </figure>`).join('')}</div>`
      : '';

    return `
      <div class="modal__hero">
        ${posterHTML(item, { large: true })}
        ${item.video
          ? `<div class="hero__actions"><button class="btn btn--play" type="button" data-play-video>${ICONS.play}${t('card.watchDemo')}</button></div>`
          : primary ? `<div class="hero__actions"><a class="btn btn--play" href="${escapeHTML(primary.href)}" target="_blank" rel="noopener">${ICONS.play}${playLabel}</a></div>` : ''}
      </div>
      <div class="modal__body">
        <div>
          <div class="modal__meta">
            ${item.match ? `<span class="match">${t('match', { n: item.match })}</span>` : ''}
            <span>${escapeHTML(tr(item.year))}</span>
            <span class="rating">L</span>
            <span>${escapeHTML(tr(item.length))}</span>
          </div>
          <p class="modal__synopsis">${escapeHTML(tr(item.synopsis))}</p>
          ${versionNote}
          ${video}
          ${gallery}
          ${learned}
        </div>
        <aside class="modal__side">
          ${code}
          <p><b>${t('modal.tech')}:</b> ${trList(item.tech).map(escapeHTML).join(', ')}</p>
          <p><b>${t('modal.type')}:</b> ${escapeHTML(tr(item.kind))}</p>
          <p><b>${t('modal.genre')}:</b> ${t('modal.genreValue')}</p>
          ${others.map((l) => `<p><a href="${escapeHTML(l.href)}" target="_blank" rel="noopener">${escapeHTML(tr(l.label))}</a></p>`).join('')}
        </aside>
      </div>`;
  }

  function skillModalHTML(skill) {
    const title = tr(skill.title);
    const skillTags = trList(skill.tags);
    const firstWord = title.split(' ')[0].toLowerCase();
    const related = [...ALL.values()].filter((i) => i.tags && i.group !== 'skills' && i.group !== 'soon' &&
      trList(i.tech).concat(trList(i.tags)).some((tag) => tag.toLowerCase().includes(firstWord) || skillTags.includes(tag)));
    return `
      <div class="modal__hero">
        <div class="poster skill" style="background:linear-gradient(160deg,#18201b,#0c0f0d)">
          <span class="skill__icon" aria-hidden="true" style="width:90px;height:90px;right:32px;top:28px">${ICONS[skill.icon] || ''}</span>
          <span class="poster__mark"><span class="brand__mark">PH</span></span>
          <h2 class="poster__title" id="modal-title">${escapeHTML(title)}</h2>
          <div class="progress"><span style="width:${skill.level}%"></span></div>
        </div>
      </div>
      <div class="modal__body">
        <div>
          <div class="modal__meta"><span class="match">${t('skill.watched', { n: skill.level })}</span><span>${t('skill.episode', { n: skill.episode })}</span></div>
          <p class="modal__synopsis">${escapeHTML(tr(skill.blurb))}</p>
          ${related.length ? `<h3 class="modal__h">${t('modal.appearsIn')}</h3>${listHTML(related.map((r) => tr(r.title)))}` : ''}
        </div>
        <aside class="modal__side"><p><b>${t('modal.topics')}:</b> ${skillTags.map(escapeHTML).join(', ')}</p></aside>
      </div>`;
  }

  function aboutHTML() {
    return `
      <div class="modal__hero">
        <div class="poster poster--hash">
          <pre class="poster__code" aria-hidden="true">${escapeHTML(t('about.code'))}</pre>
          <span class="poster__mark"><span class="brand__mark">PH</span></span>
          <h2 class="poster__title" id="modal-title">Pedro Henrique</h2>
        </div>
        <div class="hero__actions"><a class="btn btn--play" href="${CONTACT.linkedin}" target="_blank" rel="noopener">${ICONS.play}${t('about.linkedin')}</a></div>
      </div>
      <div class="modal__body">
        <div>
          <div class="modal__meta"><span class="match">${t('match', { n: 98 })}</span><span>2026</span><span class="rating">L</span><span>Blue Team</span></div>
          <p class="modal__synopsis">${t('about.synopsis')}</p>
          <h3 class="modal__h">${t('about.season')}</h3>
          ${listHTML(t('about.items'))}
        </div>
        <aside class="modal__side">
          <p><b>${t('about.education')}:</b> ${escapeHTML(tr(COURSE.name))}, ${COURSE.school}</p>
          <p><b>${t('about.interests')}:</b> ${t('about.interestsValue')}</p>
          <p><b>${t('about.looking')}:</b> ${t('about.lookingValue')}</p>
        </aside>
      </div>`;
  }

  function playModalVideo() {
    const video = $('.modal__video', modal);
    if (!video) return;
    video.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
    video.play().catch(() => { /* o navegador pode bloquear o autoplay; os controles continuam visíveis */ });
  }

  // Delegação de eventos dos cards
  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-open-about]')) { openModal(aboutHTML()); return; }
    if (e.target.closest('[data-play-video]')) { playModalVideo(); return; }
    const card = e.target.closest('.card');
    if (!card || e.target.closest('[data-stop]')) return;
    const item = ALL.get(card.dataset.id);
    if (!item) return;
    openModal(episodeHTML(item));
    if (e.target.closest('[data-play]')) playModalVideo();
  });
  document.addEventListener('keydown', (e) => {
    const card = e.target.closest && e.target.closest('.card');
    if (card && e.target === card && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      card.click();
    }
  });

  /* ---------------------------------------------------------
     Continue assistindo (progresso real do curso)
     --------------------------------------------------------- */
  let continueSeen = false;

  function renderContinue() {
    const start = new Date(COURSE.start + 'T00:00:00');
    const end = new Date(COURSE.end + 'T23:59:59');
    const now = new Date();
    const pct = Math.min(100, Math.max(0, ((now - start) / (end - start)) * 100));
    const monthsLeft = Math.max(0, (end.getFullYear() - now.getFullYear()) * 12 + end.getMonth() - now.getMonth());
    const monthsIn = (now.getFullYear() - start.getFullYear()) * 12 + now.getMonth() - start.getMonth();
    const semester = Math.min(COURSE.semesters, Math.max(1, Math.floor(monthsIn / 6) + 1));
    const pctText = pct < 10 ? pct.toFixed(1) : String(Math.round(pct));
    const pctLabel = lang === 'pt' ? pctText.replace('.', ',') : pctText;

    $('#continue').innerHTML = `
      <article class="watch">
        <div class="watch__thumb"><span>FIAP</span>${ICONS.play}</div>
        <div class="watch__body">
          <h3 class="watch__title">${escapeHTML(tr(COURSE.name))}</h3>
          <p class="watch__sub">${t('continue.semester', { s: semester, t: COURSE.semesters })}</p>
          <div class="watch__bar" role="progressbar" aria-label="${t('continue.progress')}" aria-valuenow="${Math.round(pct)}" aria-valuemin="0" aria-valuemax="100"><span data-width="${pct}"></span></div>
          <div class="watch__foot"><span>${t('continue.watched', { p: pctLabel })}</span><span>${monthsLeft > 0 ? t('continue.left', { m: monthsLeft }) : t('continue.done')}</span></div>
          <div class="watch__foot"><span>${t('continue.start')}</span><span>${t('continue.end')}</span></div>
        </div>
      </article>
      <article class="watch">
        <div class="watch__thumb watch__thumb--done"><span>RH124</span>${ICONS.play}</div>
        <div class="watch__body">
          <h3 class="watch__title">Red Hat System Administration I</h3>
          <p class="watch__sub">${t('continue.rhSub')}</p>
          <div class="watch__bar" role="progressbar" aria-label="${t('continue.rhProgress')}" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"><span data-width="100"></span></div>
          <div class="watch__foot"><span>${t('continue.watched', { p: 100 })}</span><span>${t('continue.rhDone')}</span></div>
        </div>
      </article>`;

    // Barras enchem quando a seção entra na tela (só a primeira vez)
    const bars = $$('#continue [data-width]');
    const fill = () => { continueSeen = true; bars.forEach((b) => { b.style.width = b.dataset.width + '%'; }); };
    if (continueSeen || !('IntersectionObserver' in window)) return fill();
    const io = new IntersectionObserver((entries) => {
      if (entries.some((en) => en.isIntersecting)) { fill(); io.disconnect(); }
    }, { threshold: 0.4 });
    io.observe($('#continue'));
  }

  /* ---------------------------------------------------------
     Contato
     --------------------------------------------------------- */
  $$('[data-link]').forEach((a) => {
    const kind = a.dataset.link;
    a.href = kind === 'email' ? `mailto:${CONTACT.email}` : CONTACT[kind];
  });
  $('#year').textContent = new Date().getFullYear();

  /* ---------------------------------------------------------
     Cabeçalho, menu e link ativo
     --------------------------------------------------------- */
  const topbar = $('#topbar');
  const onScroll = () => topbar.classList.toggle('is-solid', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const nav = $('#nav');
  const navToggle = $('#nav-toggle');
  const setNav = (open) => {
    nav.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? t('menu.close') : t('menu.open'));
  };
  navToggle.addEventListener('click', () => setNav(!nav.classList.contains('is-open')));
  $$('a', nav).forEach((a) => a.addEventListener('click', () => setNav(false)));

  if ('IntersectionObserver' in window) {
    const links = new Map($$('a', nav).map((a) => [a.getAttribute('href').slice(1), a]));
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        links.forEach((a) => a.classList.remove('is-active'));
        const link = links.get(en.target.id);
        if (link) link.classList.add('is-active');
      });
    }, { rootMargin: '-20% 0px -75% 0px' });
    links.forEach((_, id) => { const el = document.getElementById(id); if (el) spy.observe(el); });
  }

  /* ---------------------------------------------------------
     Perfis ("Quem está assistindo?")
     --------------------------------------------------------- */
  const profilesEl = $('#profiles');
  const synopsisEl = $('#hero-synopsis');

  // Parede de terminais do fundo. Prefixo de cada linha: $ comando, + sucesso, ! alerta, # comentário
  const WALL_SNIPPETS = [
    { title: 'pedro@fiap: ~/fim', lines: ['$ python fim.py --baseline ./etc', '+ baseline criada: 214 arquivos', '$ python fim.py --check ./etc', '! MODIFICADO  /etc/passwd', '! NOVO        /etc/cron.d/job', '! REMOVIDO    /etc/hosts.bak', '# sha256 comparado em 0.42s'] },
    { title: 'SW1 (console)', lines: ['SW1(config)# vlan 99', 'SW1(config-vlan)# name GERENCIA', 'SW1(config)# ip ssh version 2', 'SW1(config)# banner motd #ACESSO RESTRITO#', 'SW1(config-if)# switchport port-security', '+ [OK] configuração salva'] },
    { title: 'root@rhel: /var/log', lines: ['$ tail -f /var/log/secure', '! Failed password for root from 10.0.0.23', '! Failed password for root from 10.0.0.23', '! Failed password for admin from 10.0.0.23', '+ sshd: conexão encerrada', '# 3 tentativas em 4s: investigar'] },
    { title: 'pedro@rhel: ~', lines: ['$ systemctl status sshd', '+ active (running) since 08:14', '$ sudo firewall-cmd --list-services', 'ssh dhcpv6-client', '$ ls -l /etc/shadow', '----------. 1 root root /etc/shadow'] },
    { title: 'PC0 > prompt', lines: ['C:\\>ping 192.168.30.10', '+ Reply from 192.168.30.10: TTL=127', '+ Reply from 192.168.30.10: TTL=127', 'C:\\>ping 192.168.20.11', '! Destination host unreachable.', '# ACL 110 bloqueou VLAN 20'] },
    { title: 'useLoginLockout.ts', lines: ['const MAX_TENTATIVAS = 5;', 'const DURACAO_BASE_MINUTOS = 5;', 'const DURACAO_MAXIMA_MINUTOS = 60;', '# a espera dobra a cada bloqueio', 'const minutos = BASE * 2 ** nivel;', '+ return Math.min(minutos, MAXIMA);'] },
    { title: 'api: inventario-ti', lines: ['$ npm run dev', '+ API em http://localhost:3001', 'GET /api/dashboard/resumo 200', 'GET /api/hardware 200', 'GET /api/licencas 200', '! licença vence em 7 dias'] },
    { title: 'pedro@lab: ~', lines: ['$ sha256sum relatorio.pdf', '9f86d081884c7d659a2feaa0c55ad015', 'a3bf4f1b2b0b822cd15d6c15b0f00a08', '$ sha256sum -c hashes.txt', '+ relatorio.pdf: OK', '! contrato.docx: FAILED'] },
    { title: 'R1 (console)', lines: ['R1# show access-lists', 'Extended IP access list 110', '  10 deny ip 192.168.20.0 0.0.0.255 any', '  20 permit ip any any', '+ (128 matches)', 'R1# show ip ssh', '+ SSH Enabled - version 2.0'] },
    { title: 'pedro@fiap: ~', lines: ['$ whoami', 'pedro', '$ cat objetivo.txt', '+ primeira vaga em cibersegurança', '$ uptime', '# temporada 1, episódio em andamento'] }
  ];

  function wallPanelHTML(snippet, glow) {
    const body = snippet.lines.map((line) => {
      const kind = { $: 't-cmd', '+': 't-ok', '!': 't-warn', '#': 't-dim' }[line[0]];
      return kind ? `<span class="${kind}">${escapeHTML(line)}</span>` : escapeHTML(line);
    }).join('\n');
    return `<div class="term-panel${glow ? ' term-panel--glow' : ''}"><div class="term-panel__bar"><i></i><i></i><i></i><span>${escapeHTML(snippet.title)}</span></div><pre>${body}</pre></div>`;
  }

  function buildWall() {
    const wall = $('#terminal-wall');
    if (!wall || wall.childElementCount) return;
    const COLS = 8;
    let html = '';
    for (let c = 0; c < COLS; c++) {
      // Cada coluna embaralha os trechos; o conteúdo é duplicado para o loop não ter emenda
      const order = WALL_SNIPPETS.map((_, i) => (i * 3 + c * 7) % WALL_SNIPPETS.length);
      const panels = order.slice(0, 6).map((i, k) => wallPanelHTML(WALL_SNIPPETS[i], (c + k) % 9 === 4)).join('');
      const dur = 60 + ((c * 13) % 5) * 9;
      html += `<div class="wall-col${c % 2 ? ' wall-col--down' : ''}" style="--dur:${dur}s">${panels}${panels}</div>`;
    }
    wall.innerHTML = html;
  }

  const AVATAR_CLASS = { recrutador: 'profile__avatar--a', dev: 'profile__avatar--b', curioso: 'profile__avatar--c' };
  let currentProfile = '';

  function applyProfile(key, { scroll = true, animate = true } = {}) {
    const profile = PROFILES[key];
    currentProfile = key || '';
    document.body.dataset.profile = currentProfile;

    // Avatar no cabeçalho
    const avatar = $('#current-avatar');
    avatar.className = 'topbar__avatar' + (key ? ' ' + AVATAR_CLASS[key] : '');
    avatar.innerHTML = key ? $(`.profile[data-profile="${key}"] svg`).outerHTML : '';
    if (avatar.firstChild) Object.assign(avatar.firstChild.style, { width: '60%', margin: 'auto', height: '100%' });
    avatar.style.display = 'grid';
    $('#current-profile').textContent = profile ? tr(profile.label) : t('profile.switch');

    // Sinopse personalizada
    synopsisEl.textContent = profile ? tr(profile.synopsis) : t('hero.synopsis');
    if (animate) {
      synopsisEl.classList.remove('is-swapping');
      void synopsisEl.offsetWidth;
      synopsisEl.classList.add('is-swapping');
    }

    // Fileiras recomendadas para o perfil
    $$('.row__recommended').forEach((el) => el.remove());
    $$('[data-for]').forEach((section) => {
      const match = key && section.dataset.for.split(' ').includes(key);
      section.classList.toggle('is-recommended', Boolean(match));
      const title = $('.row__title', section);
      if (match && title) title.insertAdjacentHTML('beforeend', `<span class="row__recommended">${escapeHTML(t('row.recommended', { x: tr(profile.label) }))}</span>`);
    });

    if (scroll && profile) {
      const target = document.getElementById(profile.target);
      if (target) setTimeout(() => target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' }), 350);
    }
  }

  function showProfiles() {
    buildWall();
    profilesEl.hidden = false;
    profilesEl.classList.remove('is-leaving');
    document.body.classList.add('is-locked');
    $('.profile', profilesEl).focus();
  }

  function hideProfiles() {
    profilesEl.classList.add('is-leaving');
    document.body.classList.remove('is-locked');
    setTimeout(() => { profilesEl.hidden = true; }, reduceMotion ? 0 : 340);
  }

  $$('[data-profile]', profilesEl).forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.profile;
      store.set('ph-profile', key || 'none');
      hideProfiles();
      applyProfile(key);
    });
  });
  profilesEl.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') $('.profiles__skip').click();
  });
  $('#switch-profile').addEventListener('click', showProfiles);

  /* ---------------------------------------------------------
     Troca de idioma
     --------------------------------------------------------- */
  function applyStaticText() {
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
    $('meta[name="description"]').setAttribute('content', t('meta.description'));

    $$('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n, { n: el.dataset.n }); });
    $$('[data-i18n-attr]').forEach((el) => {
      el.dataset.i18nAttr.split(';').forEach((pair) => {
        const [attr, key] = pair.split(':');
        el.setAttribute(attr, t(key));
      });
    });
    $$('[data-profile-label]').forEach((el) => { el.textContent = tr(PROFILES[el.dataset.profileLabel].label); });
    navToggle.setAttribute('aria-label', nav.classList.contains('is-open') ? t('menu.close') : t('menu.open'));
  }

  function renderAll() {
    applyStaticText();
    renderRows();
    renderContinue();
    applyProfile(currentProfile, { scroll: false, animate: false });
  }

  function setLang(next) {
    if (next === lang || !LANGS.includes(next)) return;
    lang = next;
    prefs.set('ph-lang', lang);
    // Mantém o ?lang= do link coerente com a escolha, se ele existir
    const url = new URL(location.href);
    if (url.searchParams.has('lang')) {
      url.searchParams.set('lang', lang);
      history.replaceState(null, '', url);
    }
    closeModal();
    renderAll();
  }

  $$('[data-lang-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => setLang(lang === 'pt' ? 'en' : 'pt'));
  });

  renderAll();

  /* ---------------------------------------------------------
     Intro de abertura
     --------------------------------------------------------- */
  const intro = $('#intro');
  let introFinished = false;

  function afterIntro() {
    if (introFinished) return;
    introFinished = true;
    store.set('ph-intro-seen', '1');
    const saved = store.get('ph-profile');
    if (saved) applyProfile(saved === 'none' ? '' : saved, { scroll: false });
    else showProfiles();
  }

  function finishIntro() {
    if (introFinished) return;
    intro.classList.add('is-leaving');
    setTimeout(() => { intro.remove(); }, reduceMotion ? 0 : 900);
    afterIntro();
  }

  function typeLine(el, text, speed) {
    return new Promise((resolve) => {
      el.classList.add('is-typing');
      let i = 0;
      const tick = () => {
        if (introFinished) return resolve();
        el.textContent = text.slice(0, ++i);
        if (i < text.length) setTimeout(tick, speed);
        else { el.classList.remove('is-typing'); resolve(); }
      };
      tick();
    });
  }

  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  async function runIntro() {
    document.body.classList.add('is-locked');
    $('#intro-skip').addEventListener('click', finishIntro);
    document.addEventListener('keydown', function onKey(e) {
      if (e.key === 'Escape' && !introFinished) { finishIntro(); document.removeEventListener('keydown', onKey); }
    });

    const lines = $$('.intro__line', intro);
    if (reduceMotion) {
      lines.forEach((l) => { l.textContent = l.dataset.line; });
      $('.intro__name', intro).classList.add('is-visible');
      await wait(1200);
      return finishIntro();
    }
    // ~2,6s no total: três linhas digitadas, o nome surge e o zoom revela o site
    await typeLine(lines[0], lines[0].dataset.line, 22);
    await typeLine(lines[1], lines[1].dataset.line, 12);
    await typeLine(lines[2], lines[2].dataset.line, 18);
    if (introFinished) return;
    $('.intro__name', intro).classList.add('is-visible');
    await wait(650);
    finishIntro();
  }

  if (document.documentElement.classList.contains('intro-done')) {
    intro.remove();
    introFinished = true;
    const saved = store.get('ph-profile');
    if (saved) applyProfile(saved === 'none' ? '' : saved, { scroll: false });
    else showProfiles();
  } else {
    runIntro();
  }

  /* ---------------------------------------------------------
     Glitch em rajadas no título do hero
     --------------------------------------------------------- */
  const glitchEl = $('.hero__title.glitch');
  if (glitchEl && !reduceMotion) {
    const burst = () => {
      glitchEl.classList.add('is-glitching');
      setTimeout(() => glitchEl.classList.remove('is-glitching'), 450);
      setTimeout(burst, 3500 + Math.random() * 4000);
    };
    setTimeout(burst, 3200);
  }

  /* ---------------------------------------------------------
     Legenda do hero (estilo closed caption)
     --------------------------------------------------------- */
  const captionEl = $('#caption-text');
  if (captionEl) {
    let idx = 0;
    const showCaption = async () => {
      // Lê o idioma a cada frase, então a legenda acompanha a troca de idioma
      const list = CAPTIONS[lang];
      const text = list[idx % list.length];
      idx++;
      if (reduceMotion) { captionEl.textContent = text; }
      else {
        for (let i = 1; i <= text.length; i++) {
          captionEl.textContent = text.slice(0, i);
          await wait(28);
        }
      }
      await wait(2600);
      showCaption();
    };
    setTimeout(showCaption, 1200);
  }

  /* ---------------------------------------------------------
     Matrix rain discreto no fundo do hero
     --------------------------------------------------------- */
  const canvas = $('#rain');
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext('2d');
    const chars = '01ABCDEF<>/{}#$%=+*'.split('');
    const fontSize = 16;
    let cols = 0;
    let drops = [];
    let running = true;
    let last = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(width / fontSize);
      drops = Array.from({ length: cols }, () => Math.random() * -60);
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, width, height);
    };

    const draw = (time) => {
      if (!running) return;
      requestAnimationFrame(draw);
      if (time - last < 55) return; // ~18 fps basta e economiza bateria
      last = time;
      const { width, height } = canvas.getBoundingClientRect();
      ctx.fillStyle = 'rgba(10, 10, 10, 0.12)';
      ctx.fillRect(0, 0, width, height);
      ctx.font = `${fontSize}px "JetBrains Mono", monospace`;
      for (let i = 0; i < cols; i++) {
        // Só algumas colunas ativas para manter o efeito discreto
        if (i % 3 !== 0 && i % 7 !== 0) continue;
        const y = drops[i] * fontSize;
        ctx.fillStyle = Math.random() > 0.96 ? '#c8ffe4' : 'rgba(0, 255, 136, 0.55)';
        ctx.fillText(chars[(Math.random() * chars.length) | 0], i * fontSize, y);
        if (y > height && Math.random() > 0.975) drops[i] = 0;
        drops[i] += 1;
      }
    };

    resize();
    window.addEventListener('resize', resize);

    if (reduceMotion) {
      running = false;
    } else {
      requestAnimationFrame(draw);
      // Pausa quando o hero sai da tela ou a aba fica oculta
      const toggle = (on) => {
        if (on && !running) { running = true; requestAnimationFrame(draw); }
        if (!on) running = false;
      };
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(([en]) => toggle(en.isIntersecting && !document.hidden)).observe(canvas);
      }
      document.addEventListener('visibilitychange', () => toggle(!document.hidden));
    }
  }
})();
