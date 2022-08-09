"use strict";

///////////////////////////////////////
// Modal window

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const header = document.querySelector(".header");
const btnScroll = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");
const tabContainer = document.querySelector(".operations__tab-container");
const tabs = document.querySelectorAll(".operations__tab");
const tabContent = document.querySelectorAll(".operations__content");

const openModal = function () {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener("click", openModal);

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

//Adding an element
const message = document.createElement("div");
message.classList.add("cookie-message");

message.innerHTML =
  'We use cookies for improved functionality and data analytics. <button class="btn btn--close--cookie">Got it</button>';
header.append(message);
document
  .querySelector(".btn--close--cookie")
  .addEventListener("click", function () {
    message.remove(message);
  });

//Styles
message.style.backgroundColor = "#37383d";
message.style.width = "104%";

message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 30 + "px";

// Smooth scroll
btnScroll.addEventListener("click", function (e) {
  section1.scrollIntoView({ behavior: "smooth" });
});

document.querySelector(".nav__links").addEventListener("click", function (e) {
  e.preventDefault();
  if (e.target.classList.contains("nav__link")) {
    const id = e.target.getAttribute("href");
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});

//Tabs and tab content
tabContainer.addEventListener("click", function (e) {
  const clicked = e.target.closest(".operations__tab");
  if (!clicked) return;

  tabs.forEach((tab) => tab.classList.remove("operations__tab--active"));
  tabContent.forEach((c) => c.classList.remove("operations__content--active"));

  clicked.classList.add("operations__tab--active");
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add("operations__content--active");
});

//Nav link fade

const nav = document.querySelector(".nav");

const hoverHandler = function (e, opacity) {
  if (e.target.classList.contains("nav__link")) {
    const link = e.target;
    const siblings = e.target.closest("nav").querySelectorAll(".nav__link");
    siblings.forEach((el) => {
      if (el !== link) {
        el.style.opacity = opacity;
      }
    });
  }
};
nav.addEventListener("mouseover", function (e) {
  hoverHandler(e, 0.5);
});
nav.addEventListener("mouseout", function (e) {
  hoverHandler(e, 1);
});
const navHeight = nav.getBoundingClientRect().height;

const obsCallback = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add("sticky");
  else nav.classList.remove("sticky");
};
const headerObserver = new IntersectionObserver(obsCallback, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);
const section = document.querySelectorAll(".section");
const scrollCallback = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove("section--hidden");
};
const scrollObserver = new IntersectionObserver(scrollCallback, {
  root: null,
  threshold: 0.15,
});

section.forEach((sec) => {
  sec.classList.add("section--hidden");
  scrollObserver.observe(sec);
});

const images = document.querySelectorAll("img[data-src]");

const imageCallback = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  console.log(entry);
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener("load", function () {
    entry.target.classList.remove("lazy-img");
    observer.unobserve(entry.target);
  });
};
const imageObserver = new IntersectionObserver(imageCallback, {
  root: null,
  threshold: 0,
});

images.forEach((img) => imageObserver.observe(img));

let currSlide = 0;
const slides = document.querySelectorAll(".slide");
const btnRight = document.querySelector(".slider__btn--right");
const btnLeft = document.querySelector(".slider__btn--left");
const dotContainer = document.querySelector(".dots");
slides.forEach((s, i) => (s.style.transform = `translateX(${100 * i}%)`));
const maxSlides = slides.length;

const createDots = function () {
  slides.forEach((_, i) =>
    dotContainer.insertAdjacentHTML(
      "beforeend",
      `<button class="dots__dot" data-slide="${i}"></button`
    )
  );
};
createDots();

const activateDots = function (slide) {
  document
    .querySelectorAll(".dots__dot")
    .forEach((dot) => dot.classList.remove("dots__dot--active"));
  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add("dots__dot--active");
};
activateDots(0);
const slideManager = function (slide) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
  );
};
const slideIncrementorRight = function () {
  if (currSlide === maxSlides - 1) currSlide = 0;
  else currSlide++;
  slideManager(currSlide);
  activateDots(currSlide);
};

const slideDecrementorLeft = function () {
  if (currSlide === 0) currSlide = maxSlides - 1;
  else currSlide--;
  slideManager(currSlide);
  activateDots(currSlide);
};

btnRight.addEventListener("click", slideIncrementorRight);
btnLeft.addEventListener("click", slideDecrementorLeft);
document.addEventListener("keydown", function (e) {
  if (e.key === "ArrowLeft") slideDecrementorLeft();
  if (e.key === "ArrowRight") slideIncrementorRight();
});

dotContainer.addEventListener("click", function (e) {
  if (e.target.classList.contains("dots__dot")) {
    const slide = e.target.dataset.slide;
    slideManager(slide);
    activateDots(slide);
  }
});

const request = new XMLHttpRequest();
request.open("GET", "https://restcountries.com/v3.1/name/germany");
request.send();

request.addEventListener("load", function () {
  const [data] = JSON.parse(this.responseText);
  // console.log(data);
});

fetch("https://restcountries.com/v3.1/name/india")
  .then((response) => response.json())
  .then((data) => console.log(data[0]));
