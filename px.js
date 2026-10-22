(function(){var d=document,h=d.documentElement,b=(d.currentScript&&d.currentScript.src||'').replace(/px\.js.*$/,'');
var L=d.createElement('link');L.rel='stylesheet';L.href='https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400..700&display=swap';
var s=d.createElement('style');s.textContent=
"html[data-px='1'] h1,html[data-px='1'] h2,html[data-px='1'] h3,html[data-px='1'] h4,html[data-px='1'] .btn,html[data-px='1'] .tab,html[data-px='1'] .logo,html[data-px='1'] .brand b,html[data-px='1'] .nv a,html[data-px='1'] .bd,html[data-px='1'] .lab,html[data-px='1'] .steps span,html[data-px='1'] .key,html[data-px='1'] .tl b,html[data-px='1'] .rb,html[data-px='1'] .sec,html[data-px='1'] .tt,html[data-px='1'] .nm{font-family:'Pixelify Sans',ui-monospace,monospace!important}"+
"html[data-px='2'] *,html[data-px='3'] *{font-family:'Pixelify Sans',ui-monospace,monospace!important}"+
"html[data-px='3'] *{border-radius:3px!important;-webkit-font-smoothing:none;letter-spacing:.02em}"+
"html[data-px='3'] .av,html[data-px='3'] .pav,html[data-px='3'] .tg,html[data-px='3'] .bs,html[data-px='3'] .rp,html[data-px='3'] .breath i,html[data-px='3'] .lr img,html[data-px='3'] .bar2,html[data-px='3'] .bar2 i{border-radius:50%!important}"+
"html[data-px='3'] .bar2,html[data-px='3'] .bar2 i{border-radius:2px!important}html[data-px] img{image-rendering:pixelated}";
d.head.appendChild(L);d.head.appendChild(s);
window.setPx=function(n){h.dataset.px=+n||0};
try{setPx(localStorage.pvpPx)}catch(e){}
fetch(b+'site.json?'+Date.now()).then(function(r){return r.json()}).then(function(c){setPx(c.px);try{localStorage.pvpPx=c.px||0}catch(e){}}).catch(function(){});
})();
