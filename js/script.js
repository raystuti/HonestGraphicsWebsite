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

  // ── NAV TOP MASK ON SCROLL
  const bodyEl = document.body;
  const updateNavScrollMask = () => {
    if (!bodyEl) return;
    bodyEl.classList.toggle('nav-scroll-mask', window.scrollY > 12);
  };
  updateNavScrollMask();
  window.addEventListener('scroll', updateNavScrollMask, { passive:true });

  // ── SCROLL REVEAL
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if(e.isIntersecting){ e.target.classList.add('in'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.07 });
  document.querySelectorAll('.reveal').forEach(r => obs.observe(r));

  // ── SERVICES HOVER (single active card + spotlight)
  const svcGrid = document.querySelector('.svc-grid');
  if (svcGrid) {
    const svcCards = Array.from(svcGrid.querySelectorAll('.svc'));
    svcCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        svcGrid.classList.add('has-hover');
        svcCards.forEach(c => c.classList.toggle('svc-active', c === card));
      });
      card.addEventListener('mouseleave', () => {
        svcGrid.classList.remove('has-hover');
        card.classList.remove('svc-active');
      });
      card.addEventListener('focusin', () => {
        svcGrid.classList.add('has-hover');
        svcCards.forEach(c => c.classList.toggle('svc-active', c === card));
      });
      card.addEventListener('focusout', e => {
        if (!card.contains(e.relatedTarget)) {
          svcGrid.classList.remove('has-hover');
          card.classList.remove('svc-active');
        }
      });
    });
  }

  // ── QUICK QUOTE (user chooses channel)
  const qqForm = document.getElementById('quickQuoteForm');
  if (qqForm) {
    const qqSendWhatsapp = document.getElementById('qqSendWhatsapp');
    const qqSendEmail = document.getElementById('qqSendEmail');
    const qqFeedback = document.getElementById('qqFeedback');
    const qqName = document.getElementById('qqName');
    const qqPhone = document.getElementById('qqPhone');
    const qqEmail = document.getElementById('qqEmail');
    const qqService = document.getElementById('qqService');
    const qqBrief = document.getElementById('qqBrief');
    const targetWhatsappNumber = '919824385808';
    const targetEmail = 'Shreypatel3535@gmail.com';

    const fields = [qqName, qqPhone, qqEmail, qqService, qqBrief].filter(Boolean);

    const clearValidationState = () => {
      fields.forEach(field => field.classList.remove('qq-invalid'));
      if (qqFeedback) {
        qqFeedback.textContent = '';
        qqFeedback.className = 'qq-feedback';
      }
    };

    const setFeedback = (type, text) => {
      if (!qqFeedback) return;
      qqFeedback.textContent = text;
      qqFeedback.className = `qq-feedback ${type === 'error' ? 'is-error' : 'is-success'}`;
    };

    const validate = () => {
      clearValidationState();
      const name = (qqName?.value || '').trim();
      const phone = (qqPhone?.value || '').trim();
      const email = (qqEmail?.value || '').trim();
      const service = (qqService?.value || '').trim();
      const brief = (qqBrief?.value || '').trim();

      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      const phoneValid = /^[0-9+()\-\s]{8,20}$/.test(phone);

      if (!name) qqName?.classList.add('qq-invalid');
      if (!phone || !phoneValid) qqPhone?.classList.add('qq-invalid');
      if (!email || !emailValid) qqEmail?.classList.add('qq-invalid');
      if (!service) qqService?.classList.add('qq-invalid');
      if (!brief) qqBrief?.classList.add('qq-invalid');

      if (!name || !phone || !email || !service || !brief) {
        setFeedback('error', 'Please fill all fields before sending your enquiry.');
        return null;
      }
      if (!phoneValid) {
        setFeedback('error', 'Please enter a valid phone / WhatsApp number.');
        return null;
      }
      if (!emailValid) {
        setFeedback('error', 'Please enter a valid email address.');
        return null;
      }

      return { name, phone, email, service, brief };
    };

    fields.forEach(field => {
      field.addEventListener('input', () => {
        field.classList.remove('qq-invalid');
        if (qqFeedback?.classList.contains('is-error')) {
          qqFeedback.textContent = '';
          qqFeedback.className = 'qq-feedback';
        }
      });
    });

    const setLoading = (button, isLoading, loadingText, defaultText) => {
      if (!button) return;
      button.classList.toggle('is-loading', isLoading);
      button.innerHTML = isLoading ? loadingText : defaultText;
    };

    const handleSend = (channel) => {
      const actionButton = channel === 'whatsapp' ? qqSendWhatsapp : qqSendEmail;
      if (!actionButton) return;

      const defaultText = actionButton.innerHTML;
      const payload = validate();
      if (!payload) return;

      const message = [
        'Hi Honest Graphics, I just submitted a website enquiry.',
        '',
        `Name: ${payload.name}`,
        `Phone / WhatsApp: ${payload.phone}`,
        `Email: ${payload.email}`,
        `Service Required: ${payload.service}`,
        '',
        'Project Brief:',
        payload.brief
      ].join('\n');

      const whatsappLink = `https://wa.me/${targetWhatsappNumber}?text=${encodeURIComponent(message)}`;
      const emailLink = `mailto:${targetEmail}?subject=${encodeURIComponent(`New Enquiry - ${payload.service}`)}&body=${encodeURIComponent(message)}`;

      setLoading(
        actionButton,
        true,
        channel === 'whatsapp' ? 'Opening WhatsApp...' : 'Opening Email...',
        defaultText
      );

      try {
        window.location.href = channel === 'whatsapp' ? whatsappLink : emailLink;
        setFeedback('success', 'Thank you for your enquiry. Our team will get back to you shortly.');
        qqForm.reset();
      } catch (error) {
        setFeedback('error', `Could not open ${channel === 'whatsapp' ? 'WhatsApp' : 'Email'} right now. Please try again.`);
      } finally {
        setLoading(actionButton, false, '', defaultText);
      }
    };

    qqSendWhatsapp?.addEventListener('click', () => handleSend('whatsapp'));
    qqSendEmail?.addEventListener('click', () => handleSend('email'));

    qqForm.addEventListener('submit', (event) => {
      event.preventDefault();
      handleSend('whatsapp');
    });
  }
