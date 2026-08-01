(function () {
  function mediaHTML(item) {
    if (!item.media) return '';
    if (item.mediaType === 'video') {
      return `<div class="fun-media"><video controls controlsList="nodownload" disablePictureInPicture preload="metadata" oncontextmenu="return false;">` +
        `<source src="${item.media}" type="video/mp4"></video></div>`;
    }
    return `<div class="fun-media"><img src="${item.media}" alt="${item.heading}" loading="lazy"></div>`;
  }

  fetch('data/just-for-fun.json').then(r => r.json()).then(items => {
    const container = document.getElementById('fun-blocks');
    container.innerHTML = items.map(item => {
      const media = mediaHTML(item);
      const link = item.relatedLink
        ? `<a class="btn-ghost" style="margin-top:12px;" href="${item.relatedLink.url}" target="_blank" rel="noopener">${item.relatedLink.label} &rarr;</a>`
        : '';
      const years = item.years ? `<span class="fun-years">${item.years}</span>` : '';
      const textBlock = `<div><h2 class="fun-heading">${item.heading}</h2><p class="fun-caption">${item.caption}</p>${years}${link}</div>`;
      if (!media) {
        return `<div class="fade-in" style="max-width:640px; margin:0 auto 64px;">${textBlock}</div>`;
      }
      return `<div class="fun-block fade-in">${media}${textBlock}</div>`;
    }).join('');
    if (window.observeFadeIns) window.observeFadeIns(container);
  });
})();
