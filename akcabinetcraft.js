document.addEventListener('DOMContentLoaded', function() {

  // --- Lenis & Smooth Scroll ---
  const lenis = new Lenis({
    autoRaf: true,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  $("[data-lenis-toggle]").on("click", function() {
    $(this).toggleClass("stop-scroll");
    if ($(this).hasClass("stop-scroll")) {
      lenis.stop();
    } else {
      lenis.start();
    }
  });


  // --- Swiper Sliders ---
  var reviewsSwiper = new Swiper(".reviews-swiper", {
    slidesPerView: 1,
    centeredSlides: true,
    spaceBetween: 8,
    navigation: {
      nextEl: ".btn-next",
      prevEl: ".btn-prev",
    },
    breakpoints: {
      767: {
        slidesPerView: 2.2,
        centeredSlides: true,
        spaceBetween: 16
      }
    }
  });

  var testimonialsSwiper = new Swiper(".testimonials-swiper", {
    slidesPerView: 1,
    centeredSlides: true,
    spaceBetween: 8,
    navigation: {
      nextEl: ".btn-next",
      prevEl: ".btn-prev",
    },
    breakpoints: {
      767: {
        slidesPerView: 2,
        centeredSlides: false,
        spaceBetween: 16
      }
    },
    pagination: {
      el: ".swiper-pagination",
    }
  });

  var advantagesSwiper = new Swiper(".advantages-swiper", {
    slidesPerView: 1,
    centeredSlides: true,
    spaceBetween: 8,
    navigation: {
      nextEl: ".btn-next",
      prevEl: ".btn-prev",
    },
    breakpoints: {
      767: {
        slidesPerView: "auto",
        centeredSlides: false,
        spaceBetween: 16
      }
    }
  });


  // --- GSAP Animations ---

  // 1. Process Section Animation
  let mm = gsap.matchMedia();
  const processCards = gsap.utils.toArray('.process-card');
  if (processCards.length > 0) {
    const perCard = window.innerHeight;
    const total = perCard * (processCards.length + 1);

    mm.add({
      isDesktop: "(min-width: 768px)",
      isMobile: "(max-width: 767px)"
    }, (context) => {
      let { isDesktop } = context.conditions;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '.section-process',
          start: isDesktop ? 'top -85px' : 'top -20px',
          end: () => `+=${total}`,
          pin: '.progress-sticky',
          scrub: true,
        }
      });
      processCards.forEach((card, i) => {
        const finalScale = 0.8 + i * 0.02;
        const ladderOffset = (i * 5) - 6;
        tl.fromTo(card, { y: '100vh', scale: 1.1 }, { y: `${ladderOffset}vh`, scale: finalScale, ease: 'none', duration: 1 }, i * 1);
      });
      tl.to(processCards, { y: '-100vh', scale: 0, ease: 'power2.in', duration: 1, stagger: 0.1 }, processCards.length);
      return () => { tl.kill(); }
    });
  }

  // 2. Split Text Animations
  document.querySelectorAll("[data-split-heading]").forEach(el => {
    const split = new SplitText(el, { type: "words" });
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" } });
    tl.from(split.words, { duration: 0.8, yPercent: 50, autoAlpha: 0, ease: "power1.out", stagger: 0.06 });
  });

  document.querySelectorAll("[data-split-p]").forEach(el => {
    const splitP = new SplitText(el, { type: "lines" });
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" } });
    tl.from(splitP.lines, { duration: 0.6, yPercent: 100, autoAlpha: 0, ease: "power1.inOut", stagger: 0.1, delay: 0.4 });
  });

  // 3. Quality Section Animation
  const qualitySection = document.querySelector('.section-quality');
  if (qualitySection) {
    const wrappers = [...qualitySection.querySelectorAll('.quality-image-w')];
    const images = [...qualitySection.querySelectorAll('.quality-image')];
    const items = [...qualitySection.querySelectorAll('.quality-list__item')];
    const texts = [...qualitySection.querySelectorAll('.quality-content__text')];
    const lines = [...qualitySection.querySelectorAll('.quality-list__item-line')];
    const bgImages = [...qualitySection.querySelectorAll('.quality-list__item-img')];
    const count = items.length;
    const step = window.innerHeight;

    const addActive = i => {
      items[i].classList.add('is-active');
      wrappers[i].classList.add('is-active');
      texts[i].classList.add('is-active');
      bgImages[i].classList.add('is-active');
    };
    const removeActive = i => {
      items[i].classList.remove('is-active');
      wrappers[i].classList.remove('is-active');
      texts[i].classList.remove('is-active');
      bgImages[i].classList.remove('is-active');
      if (lines[i]) lines[i].style.width = '0%';
    };

    if (items.length > 0) addActive(0);

    wrappers.forEach((wrapper, i) => {
      const start = i * step;
      const end = start + step;
      gsap.set(images[i], { scale: 1.2 });
      gsap.to(images[i], { scale: 1, ease: 'power1.inOut', scrollTrigger: { trigger: qualitySection, start: `${start}px top`, end: `${end}px top`, scrub: true } });
      ScrollTrigger.create({ trigger: qualitySection, start: `${start}px top`, end: `${end}px top`, scrub: true, onEnter: () => addActive(i), onEnterBack: () => addActive(i), onLeave: () => { if (i < count - 1) removeActive(i) }, onLeaveBack: () => { if (i > 0) removeActive(i) } });
      ScrollTrigger.create({ trigger: qualitySection, start: `${start}px top`, end: `${end}px top`, scrub: true, onUpdate: self => { lines.forEach((ln, j) => { if (j === i) { ln.style.opacity = 1; ln.style.width = `${self.progress * 100}%`; } else { ln.style.opacity = 0; ln.style.width = '0%'; } }); } });
    });
  }

  // 4. Project Items Parallax
  document.querySelectorAll(".project-item").forEach(item => {
    const img = item.querySelector(".project-item__image");
    const itemShift = gsap.utils.random(-120, -60);
    const imgShift = gsap.utils.random(40, 80);
    gsap.to(item, { y: itemShift, ease: "none", scrollTrigger: { trigger: item, start: "top bottom", end: "bottom top", scrub: true } });
    gsap.to(img, { y: imgShift, ease: "none", scrollTrigger: { trigger: item, start: "top bottom", end: "bottom top", scrub: true } });
  });


  // --- Navbar Logic ---
  const nav = document.querySelector('.navbar');
  const navCorp = document.querySelector('.navbar-corp');

  // 1. Navbar Inversion Logic
  if (nav || navCorp) {
    const invertedNavPages = ['/portfolio', '/contact', '/blog', '/privacy-policy', '/posts'];
    const currentPath = window.location.pathname;
    const triggerSelectors = ['.section-hero', '.project-temaplate-hero', '.hero-cms-template'];
    const needsInversion = invertedNavPages.some(pagePrefix => currentPath.startsWith(pagePrefix));

    if (needsInversion) {
      if (navCorp) navCorp.classList.add('inverted-c');
    } else {
      triggerSelectors.forEach(selector => {
        const triggerElement = document.querySelector(selector);
        if (triggerElement) {
          ScrollTrigger.create({
            trigger: triggerElement,
            start: 'bottom top',
            onEnter: () => {
              if (nav) nav.classList.add('inverted');
              if (navCorp) navCorp.classList.add('inverted-c');
            },
            onLeaveBack: () => {
              if (nav) nav.classList.remove('inverted');
              if (navCorp) navCorp.classList.remove('inverted-c');
            }
          });
        }
      });
    }
  }

  // 2. Navbar Hide Logic
  if (nav || navCorp) {
    const hideTriggers = ['.section-cta', '.contacts-hero', '.cta-black'];
    hideTriggers.forEach(triggerClass => {
      if (document.querySelector(triggerClass)) {
        ScrollTrigger.create({
          trigger: triggerClass,
          start: 'bottom 15%',
          onEnter: () => {
            if (nav) nav.classList.add('navbar-hidden');
            if (navCorp) navCorp.classList.add('navbar-hidden');
          },
          onLeaveBack: () => {
            if (nav) nav.classList.remove('navbar-hidden');
            if (navCorp) navCorp.classList.remove('navbar-hidden');
          }
        });
      }
    });
  }

  // 3. Navbar Menu Toggle
  const btn = document.querySelector('.navbar-button');
  const menu = document.querySelector('.navbar-menu');
  if (btn && menu) {
    const links = menu.querySelector('.menu-links');
    const contacts = menu.querySelector('.navbar-contacts');
    const contactsTitle = document.querySelectorAll('.navbar-contacts__title');
    let isOpen = false;

    btn.addEventListener('click', () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      const newText = isOpen ? 'Menu' : 'Close';
      if (!isOpen) {
        isOpen = true;
        if (nav) nav.classList.add('menu-open');
        if (navCorp) navCorp.classList.add('menu-open');
        tl.to(menu, { height: '100vh', duration: 1 })
          .to([links, contacts, contactsTitle], { opacity: 1, scale: 1, duration: 0.2, }, '<')
          .to(btn, { opacity: 0, duration: 0.5 }, 0)
          .add(() => btn.textContent = newText, 0.3)
          .to(btn, { opacity: 1, duration: 0.5 }, 0.3);
      } else {
        isOpen = false;
        if (nav) nav.classList.remove('menu-open');
        if (navCorp) navCorp.classList.remove('menu-open');
        tl.to([links, contacts, contactsTitle], { opacity: 0, scale: 0.98, duration: 0.2, })
          .to(menu, { height: '0vh', duration: 1 }, '<')
          .to(btn, { opacity: 0, duration: 0.5 }, 0)
          .add(() => btn.textContent = newText, 0.3)
          .to(btn, { opacity: 1, duration: 0.5 }, 0.3);
      }
    });

    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => { if (isOpen) { btn.click(); } });
    });
  }
  
    // Hero Text Animation
// Находим ВСЕ контейнеры с анимацией на странице
const textAnimWrappers = gsap.utils.toArray('.hero-label__texts');

// Для КАЖДОГО найденного контейнера запускаем свою независимую логику
textAnimWrappers.forEach(wrapper => {
  const texts = wrapper.querySelectorAll('.hero-label__text');

  if (texts.length > 0) {
    // 1. Изначально прячем ВСЕ тексты, чтобы не было "мелькания"
    gsap.set(texts, { autoAlpha: 0, y: '100%' });

    // 2. Создаем ОСНОВНУЮ зацикленную анимацию, но оборачиваем её в функцию,
    // чтобы она не запускалась сразу.
    function startMainLoop() {
      const loopTl = gsap.timeline({ repeat: -1 });

      // Этот цикл начинается с предположением, что первый текст уже виден.
      // Он выдержит паузу, а затем начнет смену.
      texts.forEach((text, index) => {
        const currentText = texts[index];
        const nextText = texts[(index + 1) % texts.length];

        loopTl
          .to({}, { duration: 2 }) // Пауза
          .to(currentText, {
            autoAlpha: 0,
            y: '-100%',
            duration: 0.5,
            ease: 'power2.inOut'
          })
          .fromTo(nextText, 
            { y: '100%' },
            { 
              autoAlpha: 1,
              y: '0%', 
              duration: 0.5, 
              ease: 'power2.inOut',
              immediateRender: false 
            },
            '<'
          );
      });
    }

    // 3. Создаем и запускаем ОТДЕЛЬНУЮ "вступительную" анимацию.
    // Когда она завершится (onComplete), она вызовет функцию startMainLoop.
    const introTl = gsap.timeline({ onComplete: startMainLoop });
    
    introTl.to(texts[0], {
      autoAlpha: 1,
      y: '0%',
      duration: 0.5,
      ease: 'power2.out'
    });
  }
});
  
  // --- Form & Validation Logic ---
  // 1. Telegram Submission
  function sendToTelegram(message, form) {
    const token = '7856355983:AAFUBFkzMjjepXR7FAn5vEIiLhSf3kL3ZzU';
    const chatId = '-4926695493';
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const params = { chat_id: chatId, text: message, parse_mode: 'HTML' };

    fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(params) })
      .then(response => response.json())
      .then(data => {
        if (data.ok) {
          const $form = $(form);
          $form.hide();
          $form.closest('.w-form').find('.w-form-done').show();
        } else {
          alert('An error occurred while submitting. Please try again.');
        }
      }).catch(error => {
        alert('An error occurred while submitting. Please try again.');
      });
  }

  function telegramSubmitHandler(form) {
    const formData = new FormData(form);
    let message = `<b>Новая заявка с формы "${form.dataset.name || form.id}"</b>\n\n`;
    for (const [key, value] of formData.entries()) {
      if (value) { message += `<b>${key}:</b> ${value}\n`; }
    }
    sendToTelegram(message, form);
  }

  // 2. Validation Rules
  $.validator.addMethod("phoneUS_complete", function(value, element) {
    return this.optional(element) || (element.imask && element.imask.masked.isComplete);
  }, "Please enter a complete phone number.");
  $.validator.addMethod("email_strict", function(value, element) {
    return this.optional(element) || /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
  }, "Please enter the correct email address.");

  // 3. Form Validation Initialization
  $("#cta-form").validate({
    rules: { fullname: { required: true }, phone: { required: true, phoneUS_complete: true }, email: { required: true, email: true } },
    messages: { email: { email: "Invalid email" } },
    errorPlacement: function(error, element) { error.appendTo(element.closest(".input-wrapper")); },
    highlight: function(element) { $(element).css("border-bottom", "1px solid var(--error)"); },
    unhighlight: function(element) { $(element).css("border-bottom", "1px solid var(--white)"); },
    submitHandler: telegramSubmitHandler
  });
  $("#corp-cta-form").validate({
    rules: { firstname: { required: true }, lastname: { required: true }, phone: { required: true, phoneUS_complete: true }, email: { required: true, email_strict: true }, 'project-type': { required: true } },
    messages: { email: { email: "Invalid email" }, 'project-type': { required: "Please select a project type from the list to proceed." } },
    errorPlacement: function(error, element) { error.appendTo(element.closest(".input-wrapper")); },
    highlight: function(element) { $(element).css("background-color", "rgba(200, 15, 15, 0.06)").addClass("error-placeholder"); },
    unhighlight: function(element) { $(element).css("background-color", "").removeClass("error-placeholder"); },
    submitHandler: telegramSubmitHandler
  });

  // 4. Phone Input Mask
  const phoneInputs = document.querySelectorAll('input[name="phone"]');
  if (phoneInputs.length > 0) {
    const phoneMaskOptions = { mask: '+1 ({N}00) 000-0000', lazy: false, blocks: { N: { mask: IMask.MaskedRange, from: 2, to: 9 }, '0': { mask: IMask.MaskedRange, from: 0, to: 9 } } };
    phoneInputs.forEach(function(inputElement) { inputElement.imask = IMask(inputElement, phoneMaskOptions); });
  }

  // 5. Custom Success Message
  const customSuccessBlock = $('.custom-success');
  if (customSuccessBlock.length > 0) {
    const successWindow = customSuccessBlock.find('.success-window');
    const closeButton = $('#success-close');
    if (closeButton.length > 0) {
      closeButton.on('click', function(e) {
        e.preventDefault();
        const visibleSuccessMessage = $('.w-form-done').filter(':visible');
        const formBlock = visibleSuccessMessage.closest('.w-form');
        const formElement = formBlock.find('form');
        if (successWindow.length > 0) { successWindow.removeClass('is-visible'); }
        setTimeout(function() {
          customSuccessBlock.hide();
          if (visibleSuccessMessage.length) { visibleSuccessMessage.hide(); }
          if (formElement.length) { formElement.show(); formElement[0].reset(); }
        }, 400);
      });
    }
    $('#cta-form, #corp-cta-form').each(function() {
      const formElement = $(this);
      const formBlock = formElement.closest('.w-form');
      const nativeSuccessMessage = formBlock.find('.w-form-done');
      if (nativeSuccessMessage.length > 0 && customSuccessBlock.length > 0) {
        const observer = new MutationObserver(function(mutations) {
          mutations.forEach(function(mutation) {
            if (mutation.attributeName === "style" && nativeSuccessMessage.is(':visible')) {
              customSuccessBlock.css('display', 'flex');
              setTimeout(function() { if (successWindow.length > 0) { successWindow.addClass('is-visible'); } }, 50);
              observer.disconnect();
            }
          });
        });
        observer.observe(nativeSuccessMessage[0], { attributes: true });
      }
    });
  }

  // 6. Zebra Clear Input
  new $.Zebra_ClearInput('input.input-field, input.corp-input-field');
  const clearSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 10.5857L16.95 5.63574L18.364 7.04974L13.414 11.9997L18.364 16.9497L16.95 18.3637L12 13.4137L7.04999 18.3637L5.63599 16.9497L10.586 11.9997L5.63599 7.04974L7.04999 5.63574L12 10.5857Z" fill="white"/></svg>`;
  $('a.Zebra_ClearInput').each(function() { $(this).html(clearSvg); });


  // --- Miscellaneous & Helpers ---
  // 1. Portfolio Filter Height
  const filterBlock = document.querySelector('.portfolio-filter');
  function updateFilterHeight() {
    if (navCorp && filterBlock) {
      filterBlock.style.height = `calc(100vh - ${navCorp.offsetHeight}px)`;
    }
  }
  updateFilterHeight();
  window.addEventListener('resize', updateFilterHeight);

  // 2. Large Gallery Items
  document.querySelectorAll('.gallery-item').forEach((item, index) => {
    if (index % 3 === 0) {
      item.classList.add('is-large');
    }
  });

  // 3. Custom Submit Buttons
  document.querySelectorAll('[ms-code-submit-new]').forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const submitId = this.getAttribute('ms-code-submit-new');
      const oldSubmitButton = document.querySelector(`[ms-code-submit-old="${submitId}"]`);
      if (oldSubmitButton) {
        oldSubmitButton.click();
      } else {
        console.error(`No matching old submit button found for ID: ${submitId}`);
      }
    });
  });

});
