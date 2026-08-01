(function () {
  fetch('data/black-in-genetics.json').then(r => r.json()).then(data => {
    const bio = document.getElementById('big-bio');
    if (bio) bio.textContent = data.bio;

    const highlights = document.getElementById('big-highlights');
    if (highlights) highlights.innerHTML = data.highlights.map(h => `<li>${h}</li>`).join('');

    const pres = document.getElementById('big-presentations');
    if (pres) {
      pres.innerHTML = data.relatedPresentations.map(p => {
        const d = new Date(p.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        return `<div class="data-row"><div class="data-date">${d}</div><div><div class="data-title">${p.title}</div><div class="data-detail">${p.venue}</div></div></div>`;
      }).join('');
    }
  });
})();
