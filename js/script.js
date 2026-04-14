  // ── CURSOR
  const dot = document.getElementById('cDot');
  const ring = document.getElementById('cRing');
  let mx=0,my=0,rx=0,ry=0;
  document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; });
  (function loop(){
    dot.style.left=mx+'px'; dot.style.top=my+'px';
    rx+=(mx-rx)*.13; ry+=(my-ry)*.13;
    ring.style.left=rx+'px'; ring.style.top=ry+'px';
    requestAnimationFrame(loop);
  })();
  document.querySelectorAll('a,button,.svc,.ch').forEach(el=>{
    el.addEventListener('mouseenter',()=>{
      dot.style.width='12px'; dot.style.height='12px';
      ring.style.width='48px'; ring.style.height='48px'; ring.style.opacity='.22';
    });
    el.addEventListener('mouseleave',()=>{
      dot.style.width='8px'; dot.style.height='8px';
      ring.style.width='34px'; ring.style.height='34px'; ring.style.opacity='.45';
    });
  });

  // ── SCROLL REVEAL
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if(e.isIntersecting){ e.target.classList.add('in'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.07 });
  document.querySelectorAll('.reveal').forEach(r => obs.observe(r));
