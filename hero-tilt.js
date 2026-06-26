(function(){
  function play(){
    document.querySelectorAll('video').forEach(function(v){
      v.muted = true; v.loop = true; v.playsInline = true;
      if (v.paused){ var p = v.play(); if (p && p.catch) p.catch(function(){}); }
    });
  }
  var iv = setInterval(play, 600);
  window.addEventListener('load', play, { once: true });
  setTimeout(function(){ clearInterval(iv); }, 12000);

  function bindTilt(stage, tilt, opts){
    if (!stage || !tilt || stage.dataset.tilt) return;
    stage.dataset.tilt = '1';
    opts = opts || {};
    var MAX = opts.max || 11;
    var bX = opts.baseX || 0, bY = opts.baseY || 0, hoverS = opts.scale || 1.025;
    var curX = bX, curY = bY, curS = 1;
    var tgtX = bX, tgtY = bY, tgtS = 1;
    var raf = null;
    tilt.style.transition = 'none';

    function apply(){
      tilt.style.transform =
        'rotateY(' + curX.toFixed(3) + 'deg) ' +
        'rotateX(' + curY.toFixed(3) + 'deg) ' +
        'scale(' + curS.toFixed(4) + ')';
    }
    apply();

    function loop(){
      var k = 0.14;
      curX += (tgtX - curX) * k;
      curY += (tgtY - curY) * k;
      curS += (tgtS - curS) * k;
      apply();
      var settled = Math.abs(tgtX - curX) < 0.02
        && Math.abs(tgtY - curY) < 0.02
        && Math.abs(tgtS - curS) < 0.0008;
      if (settled){ curX = tgtX; curY = tgtY; curS = tgtS; apply(); raf = null; }
      else { raf = requestAnimationFrame(loop); }
    }

    function kick(){ if (raf === null){ raf = requestAnimationFrame(loop); } }

    stage.addEventListener('mousemove', function(ev){
      var r = stage.getBoundingClientRect();
      var px = (ev.clientX - r.left) / r.width - 0.5;
      var py = (ev.clientY - r.top) / r.height - 0.5;
      tgtX = bX + px * MAX;
      tgtY = bY + (0 - py) * MAX;
      tgtS = hoverS;
      kick();
    });

    stage.addEventListener('mouseleave', function(){
      tgtX = bX; tgtY = bY; tgtS = 1; kick();
    });
  }

  function setupTilt(){
    var hs = document.querySelector('.deo-stage'), ht = document.querySelector('.deo-tilt');
    var fs = document.querySelector('.ff-stage'),  ft = document.querySelector('.ff-tilt');
    if (!hs && !fs){ return setTimeout(setupTilt, 300); }
    bindTilt(hs, ht, { max: 11 });
    bindTilt(fs, ft, { max: 13, baseX: -10, baseY: 3, scale: 1.035 });
  }
  setupTilt();

  function setupScrollCue(){
    var cue = document.getElementById('deo-scroll-cue');
    if (!cue){ return setTimeout(setupScrollCue, 300); }
    function target(){ return document.querySelector('.deo-feat-section'); }
    cue.addEventListener('click', function(){
      var t = target();
      var top = t ? t.getBoundingClientRect().top + window.pageYOffset : window.innerHeight;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
    function onScroll(){
      var hide = window.pageYOffset > 8;
      cue.style.opacity = hide ? '0' : '1';
      cue.style.transform = 'translateX(-50%) translateY(' + (hide ? '12px' : '0') + ')';
      cue.style.pointerEvents = hide ? 'none' : 'auto';
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
  setupScrollCue();

  function setupCardGlow(){
    var tiles = document.querySelectorAll('.feat-tile');
    if (!tiles.length){ return setTimeout(setupCardGlow, 300); }
    tiles.forEach(function(tile){
      tile.addEventListener('mousemove', function(e){
        var r = tile.getBoundingClientRect();
        tile.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        tile.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }
  setupCardGlow();

  // JS-driven hovers: these elements live where inline base styles outrank the
  // compiled :hover rules, so swap inline styles directly on enter/leave.
  function setupBtnHovers(){
    function bind(el, enter){
      if (!el || el.dataset.hoverBound) return;
      el.dataset.hoverBound = '1';
      var base = {};
      Object.keys(enter).forEach(function(k){ base[k] = el.style[k]; });
      el.addEventListener('mouseenter', function(){ Object.keys(enter).forEach(function(k){ el.style[k] = enter[k]; }); });
      el.addEventListener('mouseleave', function(){ Object.keys(enter).forEach(function(k){ el.style[k] = base[k]; }); });
    }
    var actions = document.querySelector('.deo-nav-actions');
    var premium = actions ? actions.querySelector('.deo-navbtn') : null;
    var dl = document.querySelector('.deo-cta a');
    if (!premium || !dl){ return setTimeout(setupBtnHovers, 300); }
    bind(dl, { background:'#47bdea', boxShadow:'0 0 0 1px rgba(150,228,255,.7) inset, 0 10px 32px rgba(63,184,227,.6), 0 0 90px rgba(63,184,227,.6)' });

    // hero "Free Download" → smooth-scroll to the download CTA section
    if (!dl.dataset.scrollBound){
      dl.dataset.scrollBound = '1';
      dl.addEventListener('click', function(e){
        var t = document.querySelector('.deo-dl-section');
        if (t){ e.preventDefault(); window.scrollTo({ top: t.getBoundingClientRect().top + window.pageYOffset - 72, behavior: 'smooth' }); }
      });
    }

    // menu text links: brighten to full white on hover
    var menuLinks = document.querySelectorAll('.deo-nav-center a, .deo-nav-actions a');
    menuLinks.forEach(function(a){
      if (a.classList.contains('deo-navbtn')) return; // colored pills keep their own text color
      bind(a, { color:'#fff' });
    });
  }
  setupBtnHovers();

  // Floating header: transparent at the very top, blurred rounded backdrop on scroll.
  function setupHeader(){
    var header = document.getElementById('deo-header');
    var inner = document.getElementById('deo-header-inner');
    if (!inner || !header){ return setTimeout(setupHeader, 300); }
    header.style.transition = 'transform .35s ease, opacity .35s ease';
    var dlSection = document.querySelector('.deo-dl-section');
    var on = null, hidden = null;
    function apply(scrolled){
      if (scrolled === on) return;
      on = scrolled;
      if (scrolled){
        inner.style.background = 'rgba(9,14,24,.72)';
        inner.style.backdropFilter = 'blur(18px) saturate(140%)';
        inner.style.webkitBackdropFilter = 'blur(18px) saturate(140%)';
        inner.style.borderColor = 'rgba(255,255,255,.1)';
        inner.style.boxShadow = '0 14px 36px rgba(0,0,0,.45)';
      } else {
        inner.style.background = 'transparent';
        inner.style.backdropFilter = 'none';
        inner.style.webkitBackdropFilter = 'none';
        inner.style.borderColor = 'transparent';
        inner.style.boxShadow = 'none';
      }
    }
    function setHidden(h){
      if (h === hidden) return;
      hidden = h;
      header.style.opacity = h ? '0' : '1';
      header.style.transform = h ? 'translateY(-120%)' : 'translateY(0)';
      header.style.pointerEvents = h ? 'none' : 'auto';
    }
    function onScroll(){
      apply(window.pageYOffset > 8);
      // hide the fixed header once the CTA ("Don't think twice") reaches the top
      if (dlSection){ setHidden(dlSection.getBoundingClientRect().top < 90); }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
  setupHeader();
})();
