'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const header = document.querySelector('.header');
const allSections = document.querySelectorAll('section');

const navLinksRef = document.querySelector('.nav__links');
const nav = document.querySelector('.nav');

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

const imgTargets = document.querySelectorAll('img[data-src]');

const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');

btnScrollTo.addEventListener('click', onBtnSkrolToClick);
navLinksRef.addEventListener('click', onNavLinksClick);

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

function onBtnSkrolToClick(e) {
  // const s1cords = section1.getBoundingClientRect();
  // console.log(s1cords);
  // console.log(e.target.getBoundingClientRect());
  // console.log(`Current scroll X/Y`, window.pageXOffset, pageYOffset);
  // console.log(
  //   'Higth and width of viewport',
  //   document.documentElement.clientHeight,
  //   document.documentElement.clientWidth
  // );

  // window.scrollTo(
  //   s1cords.left + window.pageXOffset,
  //   s1cords.top + window.pageYOffset
  // );

  // window.scrollTo({
  //   left: s1cords.left + window.pageXOffset,
  //   top: s1cords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  section1.scrollIntoView({ behavior: 'smooth' });
}

// Page nav

function onNavLinksClick(e) {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
}

// Menu fade animation

nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));

function handleHover(e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
}

// Tabbed component

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  if (!clicked) return;

  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  tabsContent.forEach(el => el.classList.remove('operations__content--active'));

  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// Sticky navigation

// const initialCoord = section1.getBoundingClientRect();
// console.log(initialCoord);
// window.addEventListener('scroll', function (e) {
//   if (window.scrollY > initialCoord.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

// Sticky navigation IntersectionObserver API

const navHeight = nav.getBoundingClientRect().height;

function stickyNav(entries) {
  const [entrie] = entries;

  if (!entrie.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
}

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `${navHeight}px`,
});

headerObserver.observe(header);

// Reveal sections

function revealSection(entries, observer) {
  const [entrie] = entries;

  if (!entrie.isIntersecting) return;
  entrie.target.classList.remove('section--hidden');

  observer.unobserve(entrie.target);
}

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(section => {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});

// lazy loading

const imgObserver = new IntersectionObserver(loadingImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

function loadingImg(entries, observer) {
  const [entrie] = entries;

  if (!entrie.isIntersecting) return;

  entrie.target.src = entrie.target.dataset.src;

  entrie.target.addEventListener('load', function () {
    entrie.target.classList.remove('lazy-img');
  });
  observer.unobserve(entrie.target);
}

// Slider

let curSlide = 0;
const maxSlides = slides.length - 1;

init();

btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prenSlide);
document.addEventListener('keydown', e => {
  if (e.code !== 'ArrowLeft' && e.code !== 'ArrowRight') return;
  e.code === 'ArrowRight' && nextSlide();
  e.code === 'ArrowLeft' && prenSlide();
});

dotContainer.addEventListener('click', onDotsClick);

function init() {
  createDots();
  goToSlide(0);
  activeDot(0);
}

function nextSlide() {
  if (curSlide === maxSlides) {
    curSlide = 0;
  } else {
    curSlide += 1;
  }

  goToSlide(curSlide);
  activeDot(curSlide);
}

function prenSlide() {
  if (curSlide === 0) {
    curSlide = maxSlides;
  } else {
    curSlide -= 1;
  }
  goToSlide(curSlide);
  activeDot(curSlide);
}

function goToSlide(s) {
  slides.forEach((slide, i) => {
    slide.style.transform = `translateX(${100 * (i - s)}%)`;
  });
}

function createDots() {
  slides.forEach((_, i) => {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class='dots__dot' data-slide='${i}'></button>`
    );
  });
}

function onDotsClick(e) {
  if (e.target.classList.contains('dots__dot')) {
    const { slide } = e.target.dataset;
    goToSlide(slide);
    activeDot(slide);
  }
}

function activeDot(slide) {
  document.querySelectorAll('.dots__dot').forEach(dot => {
    if (dot.classList.contains('dots__dot--active')) {
      dot.classList.remove('dots__dot--active');
    }
  });

  document
    .querySelector(`.dots__dot[data-slide='${slide}']`)
    .classList.add('dots__dot--active');
}

// window.addEventListener('beforeunload', e => {
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = '';
// });
