(function () {
  function row(dateLabel, titleHTML, detailHTML, extraHTML) {
    return `<div class="data-row">` +
      `<div class="data-date">${dateLabel}</div>` +
      `<div><div class="data-title">${titleHTML}</div>` +
      (detailHTML ? `<div class="data-detail">${detailHTML}</div>` : '') +
      (extraHTML || '') +
      `</div></div>`;
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  function fmtDate(d, dEnd) {
    const opts = { month: 'short', day: 'numeric', year: 'numeric' };
    const start = new Date(d + 'T00:00:00');
    if (!dEnd) return start.toLocaleDateString('en-US', opts);
    const end = new Date(dEnd + 'T00:00:00');
    if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
      return `${start.toLocaleDateString('en-US', { month: 'short' })} ${start.getDate()}–${end.getDate()}, ${start.getFullYear()}`;
    }
    return `${start.toLocaleDateString('en-US', opts)} – ${end.toLocaleDateString('en-US', opts)}`;
  }

  function render(id, html) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  }

  fetch('data/cv.json').then(r => r.json()).then(cv => {
    render('education-list', cv.education.map(e =>
      row(e.date, `${esc(e.title)} — ${esc(e.org)}`, e.detail)).join(''));

    render('grants-list', cv.grantsAndFellowships.map(g =>
      row(g.date, esc(g.title), g.detail)).join(''));

    render('awards-list', cv.awards.map(a =>
      row(a.date, esc(a.title))).join(''));

    render('teaching-list', cv.teaching.map(t =>
      row(t.date, esc(t.title), t.org ? esc(t.org) : '')).join(''));

    render('service-list', cv.service.map(s =>
      row(s.date, esc(s.title), s.org ? esc(s.org) : '')).join(''));

    render('mentoring-list', cv.mentoring.map(m =>
      row(esc(m.role), esc(m.name), esc(m.org))).join(''));
  });

  fetch('data/publications.json').then(r => r.json()).then(pubs => {
    render('publications-list', pubs.map(p => {
      const titleHTML = p.doi
        ? `<a href="https://doi.org/${encodeURI(p.doi)}" target="_blank" rel="noopener">${esc(p.title)}</a>`
        : esc(p.title);
      const detail = `${p.authors.join(', ')} — ${esc(p.journal)}`;
      const tags = `<div class="tag-row">${p.tags.map(t => `<span class="tag">${esc(t)}</span>`).join('')}</div>`;
      const summary = p.plainLanguageSummary
        ? `<p class="body-copy muted" style="margin-top:10px; font-size:0.88rem;">${esc(p.plainLanguageSummary)}</p>`
        : '';
      return row(p.year, titleHTML, detail, tags + summary);
    }).join(''));
  });

  fetch('data/presentations.json').then(r => r.json()).then(pres => {
    function presRow(p) {
      const extras = p.authors && p.authors.length > 1 ? ` (with ${p.authors.slice(1).join(', ')})` : '';
      return row(fmtDate(p.date, p.dateEnd), esc(p.title), `${esc(p.venue)}${extras}`);
    }
    render('oral-list', pres.oral.map(presRow).join(''));
    render('poster-list', pres.posters.map(presRow).join(''));
  });

})();
