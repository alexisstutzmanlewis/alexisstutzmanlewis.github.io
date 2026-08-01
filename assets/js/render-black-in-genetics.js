(function () {
  function fmtDate(dateStr, approx) {
    if (approx) {
      const [y, m] = dateStr.split('-');
      const label = new Date(`${dateStr}-01T00:00:00`).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      return label;
    }
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function sortKey(item) { return item.dateApprox ? item.date + '-01' : item.date; }
  function byDateDesc(a, b) { return sortKey(b).localeCompare(sortKey(a)); }

  fetch('data/black-in-genetics.json').then(r => r.json()).then(data => {
    const bio = document.getElementById('big-bio');
    if (bio) bio.innerHTML = data.bioHtml;

    const highlights = document.getElementById('big-highlights');
    if (highlights) highlights.innerHTML = data.highlights.map(h => `<li>${h}</li>`).join('');

    if (data.ceremonyPhoto) {
      const img = document.getElementById('big-ceremony-img');
      const cap = document.getElementById('big-ceremony-caption');
      if (img) { img.src = data.ceremonyPhoto.src; img.alt = data.ceremonyPhoto.alt; }
      if (cap) cap.textContent = data.ceremonyPhoto.caption;
    }

    const awards = document.getElementById('big-awards');
    if (awards) {
      awards.innerHTML = data.awards.map(a =>
        `<div class="data-row"><div class="data-date">${a.date}</div><div><div class="data-title">${a.title}</div>` +
        (a.detail ? `<div class="data-detail">${a.detail}</div>` : '') +
        `</div></div>`
      ).join('');
    }

    const pres = document.getElementById('big-presentations');
    if (pres) {
      pres.innerHTML = [...data.relatedPresentations].sort(byDateDesc).map(p => {
        const d = fmtDate(p.date);
        return `<div class="data-row"><div class="data-date">${d}</div><div><div class="data-title">${p.title}</div><div class="data-detail">${p.venue}</div></div></div>`;
      }).join('');
    }

    const press = document.getElementById('big-press');
    if (press) {
      press.innerHTML = [...data.press].sort(byDateDesc).map(item => {
        const d = fmtDate(item.date, item.dateApprox);
        const byline = item.author ? `${item.outlet} &middot; ${item.author}` : item.outlet;
        const videoLink = item.videoUrl ? ` &middot; <a href="${item.videoUrl}" target="_blank" rel="noopener">Watch on YouTube</a>` : '';
        return `<div class="data-row"><div class="data-date">${d}</div><div>` +
          `<div class="data-title"><a href="${item.url}" target="_blank" rel="noopener">${item.title}</a></div>` +
          `<div class="data-detail">${byline}${videoLink}</div>` +
          `</div></div>`;
      }).join('');
    }
  });
})();
