'use strict';

//==================================================//
//============== Bankist Landing Page =============//
//================================================//

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const header = document.querySelector('.header');

const featuresSection = document.getElementById('section--1');
const operationsSection = document.getElementById('section--2');
const testimonialsSection = document.getElementById('section--3');
const signUpSection = document.getElementById('section--4');
const allSections = document.querySelectorAll('section');

const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnCloseModal = document.querySelector('.btn--close-modal');

const linkFeatures = document.querySelector('.features-link');
const linkOperations = document.querySelector('.operations-link');
const linkTestimonials = document.querySelector('.testimonials-link');

const nav = document.querySelector('.nav');

//==================== Open Modal Window ====================//
const openModal = function (evt) {
  // when a tag has href, it's default behaviour is back to top
  evt.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

btnsOpenModal.forEach(function (btn) {
  btn.addEventListener('click', openModal);
});

//==================== Close Modal Window ====================//
const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};
// Close button
btnCloseModal.addEventListener('click', closeModal);

// Click overlay
overlay.addEventListener('click', closeModal);

// Escape Key
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//==================== Cookie Message ====================//
// Show Cookie
const cookie = document.createElement('div');
cookie.classList.add('cookie-message');
cookie.innerHTML = `<p>We use cookies to improve performance and site analytics.</p><button class='btn btn-close-cookie'>Got it</button>`;
header.append(cookie);

// Hide Cookie
const btnCloseCookie = document.querySelector('.btn-close-cookie');
btnCloseCookie.addEventListener('click', function () {
  cookie.remove();
});

// Style Cookie
cookie.style.backgroundColor = '#37383d';
cookie.style.width = 'calc(100% + 60px)';
cookie.querySelector('p').style.color = '#f6f6f6';
cookie.style.height =
  Number.parseFloat(getComputedStyle(cookie).height) + 30 + 'px';

//==================== BTN Smooth Scrolling ====================//
let learnMoreBtn = document.querySelector('.btn--scroll-to');
let smoothScroll = function (section) {
  let sectionCords = section.getBoundingClientRect();
  window.scrollTo({
    left: sectionCords.left + window.scrollX,
    top: sectionCords.top + window.scrollY,
    behavior: 'smooth',
  });
};
learnMoreBtn.addEventListener(
  'click',
  smoothScroll.bind(learnMoreBtn, featuresSection)
);

//=============== Navigation Smooth Scrolling ===============//
// With Delegation
const navLinks = document.querySelector('.nav__links');
navLinks.addEventListener('click', function (evt) {
  if (evt.target.classList.contains('navi__link')) {
    evt.preventDefault();
    const linkHref = evt.target.getAttribute('href');
    const viewSection = document.querySelector(linkHref);
    viewSection.scrollIntoView({ behavior: 'smooth' });
  }
});

//=============== Tabbed Component ===============//
const opTabsContainer = document.querySelector('.operations__tab-container');
const opTabs = document.querySelectorAll('.operations__tab');
const opContentAll = document.querySelectorAll('.operations__content');

opTabsContainer.addEventListener('click', function (evt) {
  // DOM Traversing
  const clickedTab = evt.target.closest('.operations__tab');
  // Guard Clause
  if (!clickedTab) return;

  // Remove Activation from other tabs
  opTabs.forEach(t => t.classList.remove('operations__tab--active'));

  // Activate Clicked tab
  clickedTab.classList.add('operations__tab--active');

  // Hide any Tab Content
  opContentAll.forEach(content =>
    content.classList.remove('operations__content--active')
  );
  // Display Tab Content
  const tabToShow = document.querySelector(
    `.operations__content--${clickedTab.dataset.tab}`
  );
  tabToShow.classList.add('operations__content--active');
});

//==================== Navigation Fade Effect ====================//
const handleHover = function (evt) {
  if (evt.target.classList.contains('nav__link')) {
    const link = evt.target;

    const siblings = link.closest('.nav__links').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('.nav__logo');

    siblings.forEach(el => {
      if (el !== link) {
        el.style.opacity = this; // this = 0.5
      }
    });
    logo.style.opacity = this; // this = 1
  }
};
// On Hover
nav.addEventListener('mouseover', handleHover.bind(0.5));

// On Mouse Leave
nav.addEventListener('mouseout', handleHover.bind(1));

//==================== Sticky Navigation ====================//

// Intersection observer API
const navHeight = nav.getBoundingClientRect().height;
const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
};
const stickyOptions = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
};
const navIntersectionObserver = new IntersectionObserver(
  stickyNav,
  stickyOptions
);
navIntersectionObserver.observe(header);

//==================== Reveal on scroll ====================//

const revealFun = function (entries, observer) {
  const [entry] = entries;
  if (entry.isIntersecting) {
    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
  }
};

const revealOptions = {
  root: null,
  threshold: 0.15,
};

const revealIntersection = new IntersectionObserver(revealFun, revealOptions);
allSections.forEach(section => {
  revealIntersection.observe(section);
  section.classList.add('section--hidden');
});

//==================== Lazy Loading ====================//

const lazyImages = document.querySelectorAll('img[data-src]');

const lazyCallback = function (entries, observer) {
  const [entry] = entries;
  // if only Intersects
  if (!entry.isIntersecting) return;

  // load High-Resolution Image
  entry.target.src = entry.target.dataset.src;

  // When loading is finished unobserve the image
  entry.target.addEventListener('load', function () {
    observer.unobserve(entry.target);
  });

  // remove the blur
  entry.target.classList.remove('lazy-img');
};
const lazyOptions = {
  root: null,
  threshold: 0,
};
const lazyIntersection = new IntersectionObserver(lazyCallback, lazyOptions);
lazyImages.forEach(img => lazyIntersection.observe(img));

//==================== Slider Component ====================//
const slider = function () {
  let allSlides = document.querySelectorAll('.slide');
  let leftBtn = document.querySelector('.slider__btn--left');
  let rightBtn = document.querySelector('.slider__btn--right');
  let dotsContainer = document.querySelector('.dots');

  // Current Slide & slides length
  let currentSlide = 0;
  let slidesNumber = allSlides.length;

  // Position Slides
  const positionSlides = function (currentSlide) {
    allSlides.forEach(function (slide, index) {
      slide.style.transform = `translateX(${100 * (index - currentSlide)}%)`;
    });
  };

  // Creating Dots
  const createDots = function () {
    allSlides.forEach((_, i) => {
      dotsContainer.insertAdjacentHTML(
        'beforeend',
        `<button class='dots__dot' data-slide='${i}'></button>`
      );
    });
  };

  // Style Dots
  const activateDot = function (currentS) {
    // Remove the active class
    document.querySelectorAll('.dots__dot').forEach(dot => {
      dot.classList.remove('dots__dot--active');
    });

    // add Active class to current slide's dot
    document
      .querySelector(`.dots__dot[data-slide="${currentS}"]`)
      .classList.add('dots__dot--active');
  };

  // Initial Settings
  const init = function () {
    positionSlides(0);
    createDots();
    activateDot(0);
  };
  init();

  // Next Slide
  const nextSlide = function () {
    if (currentSlide === slidesNumber - 1) {
      currentSlide = 0;
    } else {
      currentSlide++;
    }
    positionSlides(currentSlide);
    activateDot(currentSlide);
  };

  // Prev Slide
  const prevSlide = function () {
    if (currentSlide <= 0) {
      currentSlide = slidesNumber - 1;
    } else {
      currentSlide--;
    }
    positionSlides(currentSlide);
    activateDot(currentSlide);
  };

  rightBtn.addEventListener('click', nextSlide);
  leftBtn.addEventListener('click', prevSlide);

  // listening to Keyboard
  document.addEventListener('keydown', function (e) {
    const key = e.key;
    if (key === 'ArrowRight') {
      nextSlide();
    } else if (key === 'ArrowLeft') {
      prevSlide();
    }
  });

  // listening to dots clicks
  dotsContainer.addEventListener('click', function (evt) {
    if (evt.target.classList.contains('dots__dot')) {
      // move to the slide
      positionSlides(evt.target.dataset.slide);
      activateDot(evt.target.dataset.slide);
    }
  });
};
slider();
