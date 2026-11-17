(function () {
  function mediaHTML(item) {
    if (!item.media) return '';
    if (item.mediaType === 'video') {
      return `<div class="fun-media"><video controls controlsList="nodownload" disablePictureInPicture preload="metadata" oncontextmenu="return false;">` +
        `<source src="${item.media}" type="video/mp4"></video></div>`;
    }
    return `<div class="fun-media"><img src="${item.media}" alt="${item.alt || item.heading}" loading="lazy"></div>`;
  }

  function linkHTML(item) {
    return item.relatedLink
      ? `<a class="arrow-link" style="margin-top:12px;" href="${item.relatedLink.url}" target="_blank" rel="noopener">${item.relatedLink.label} &rarr;</a>`
      : '';
  }

  function textHTML(item) {
    const years = item.years ? `<span class="fun-years">${item.years}</span>` : '';
    return `<div><h2 class="fun-heading">${item.heading}</h2><p class="fun-caption">${item.caption}</p>${years}${linkHTML(item)}</div>`;
  }

  fetch('data/just-for-fun.json').then(r => r.json()).then(items => {
    const blocks = document.getElementById('fun-blocks');
    const tribute = document.getElementById('fun-tribute');

    blocks.innerHTML = items.filter(i => i.variant !== 'tribute').map(item => {
      const media = mediaHTML(item);
      if (!media) {
        return `<div class="fade-in" style="max-width:640px; margin:0 auto 64px;">${textHTML(item)}</div>`;
      }
      return `<div class="fun-block fade-in">${media}${textHTML(item)}</div>`;
    }).join('');

    const t = items.find(i => i.variant === 'tribute');
    if (t && tribute) {
      tribute.innerHTML = `<div class="tribute-inner fade-in">${mediaHTML(t)}${textHTML(t)}</div>`;
      tribute.hidden = false;
    }

    if (window.observeFadeIns) { window.observeFadeIns(blocks); window.observeFadeIns(tribute); }
  });
})();
