(function () {
  const properties = [
    { img: "images/img_6.jpg", price: "$1,291,000", addr: "1076 Parvulus Avenue, New York", city: "California, USA", bed: 4, bath: 2 },
    { img: "images/img_7.jpg", price: "$1,291,000", addr: "1076 Parvulus Avenue, New York", city: "California, USA", bed: 4, bath: 2 },
    { img: "images/img_8.jpg", price: "$1,291,000", addr: "1076 Parvulus Avenue, New York", city: "California, USA", bed: 4, bath: 2 },
    { img: "images/img_3.jpg", price: "$1,291,000", addr: "1076 Parvulus Avenue, New York", city: "California, USA", bed: 4, bath: 2 },
    { img: "images/img_5.jpg", price: "$1,291,000", addr: "1076 Parvulus Avenue, New York", city: "California, USA", bed: 4, bath: 2 },
    { img: "images/img_1.jpg", price: "$1,291,000", addr: "1076 Parvulus Avenue, New York", city: "California, USA", bed: 4, bath: 2 },
    { img: "images/img_4.jpg", price: "$1,291,000", addr: "1076 Parvulus Avenue, New York", city: "California, USA", bed: 4, bath: 2 }
  ];
  const AUTOPLAY_MS = 5000;

  const viewport = document.getElementById("psViewport");
  const track = document.getElementById("psTrack");
  const dotsBox = document.getElementById("psDots");
  const prevBtn = document.getElementById("psPrev");
  const nextBtn = document.getElementById("psNext");
  const section = viewport.closest(".ps-section");

  track.innerHTML = properties.map(p => `
    <article class="ps-card">
    <img src="${p.img}" alt="Property at ${p.addr}">
      <div class="ps-body">
        <p class="ps-price">${p.price}</p>
        <p class="ps-addr">${p.addr}</p>
        <p class="ps-city">${p.city}</p>
        <div class="ps-meta">
          <span><i class="fa-solid fa-bed"></i>Bed: ${p.bed}</span>
          <span><i class="fa-solid fa-bath"></i>Bath: ${p.bath}</span>
        </div>
        <button type="button">See details</button>
      </div>
    </article>`).join("");

  let index = 0, perView = 3, timer = null;

  const getPerView = () => {
    const w = window.innerWidth;
    if (w < 576) return 1;
    if (w < 992) return 2;
    if (w < 1400) return 3;
    return 5;
  };
  const maxIndex = () => Math.max(0, properties.length - perView);

  function stepSize() {
    const card = track.children[0];
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    return card.getBoundingClientRect().width + gap;
  }

  function buildDots() {
    dotsBox.innerHTML = "";
    for (let i = 0; i <= maxIndex(); i++) {
      const d = document.createElement("button");
      d.className = "ps-dot";
      d.type = "button";
      d.setAttribute("role", "tab");
      d.setAttribute("aria-label", "Go to slide " + (i + 1));
      d.addEventListener("click", () => { goTo(i); restartAutoplay(); });
      dotsBox.appendChild(d);
    }
  }

  function render() {
    track.style.transform = `translateX(${-index * stepSize()}px)`;
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === maxIndex();
    [...dotsBox.children].forEach((d, i) => d.setAttribute("aria-selected", i === index));
  }

  function goTo(i) {
    index = Math.min(Math.max(i, 0), maxIndex());
    render();
  }

  function layout() {
    perView = getPerView();
    section.style.setProperty("--ps-per", perView);
    index = Math.min(index, maxIndex());
    buildDots();
    render();
  }

  prevBtn.addEventListener("click", () => { goTo(index - 1); restartAutoplay(); });
  nextBtn.addEventListener("click", () => { goTo(index + 1); restartAutoplay(); });

  viewport.tabIndex = 0;
  viewport.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft")  { goTo(index - 1); restartAutoplay(); }
    if (e.key === "ArrowRight") { goTo(index + 1); restartAutoplay(); }
  });

  let startX = 0, dx = 0, dragging = false;
  viewport.addEventListener("pointerdown", e => {
    dragging = true;
    startX = e.clientX;
    dx = 0;
    track.classList.add("is-dragging");
    viewport.setPointerCapture(e.pointerId);
  });
  viewport.addEventListener("pointermove", e => {
    if (!dragging) return;
    dx = e.clientX - startX;
    track.style.transform = `translateX(${-index * stepSize() + dx}px)`;
  });
  function endDrag() {
    if (!dragging) return;
    dragging = false;
    track.classList.remove("is-dragging");
    if (Math.abs(dx) > 50) goTo(index + (dx < 0 ? 1 : -1));
    else render();
    restartAutoplay();
  }
  viewport.addEventListener("pointerup", endDrag);
  viewport.addEventListener("pointercancel", endDrag);

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function startAutoplay() {
    if (!AUTOPLAY_MS || reduceMotion) return;
    timer = setInterval(() => goTo(index >= maxIndex() ? 0 : index + 1), AUTOPLAY_MS);
  }
  function stopAutoplay() { clearInterval(timer); }
  function restartAutoplay() { stopAutoplay(); startAutoplay(); }
  section.addEventListener("mouseenter", stopAutoplay);
  section.addEventListener("mouseleave", startAutoplay);
  section.addEventListener("focusin", stopAutoplay);
  section.addEventListener("focusout", startAutoplay);

  window.addEventListener("resize", layout);
  layout();
  startAutoplay();
})();