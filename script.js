const sections = [...document.querySelectorAll(".page-section")];
const dots = [...document.querySelectorAll(".section-dot")];
const revealTargets = [...document.querySelectorAll("[data-reveal]")];
const printButton = document.getElementById("printButton");
const backToTopButton = document.getElementById("backToTop");

const setActiveDot = (id) => {
  dots.forEach((dot) => {
    dot.classList.toggle("is-active", dot.dataset.target === id);
  });
};

dots.forEach((dot) => {
  dot.addEventListener("click", () => {
    const target = document.getElementById(dot.dataset.target);
    if (!target) return;

    target.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "start"
    });
  });
});

const sectionObserver = new IntersectionObserver(
  (entries) => {
    const visibleEntry = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (visibleEntry) {
      setActiveDot(visibleEntry.target.id);
      document.title = `CareWise | ${visibleEntry.target.dataset.title || "Company Profile"}`;
    }
  },
  {
    threshold: [0.25, 0.45, 0.65]
  }
);

sections.forEach((section) => sectionObserver.observe(section));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.14,
    rootMargin: "0px 0px -10% 0px"
  }
);

revealTargets.forEach((element) => revealObserver.observe(element));

if (printButton) {
  printButton.addEventListener("click", () => {
    window.print();
  });
}

if (backToTopButton) {
  const toggleBackToTop = () => {
    backToTopButton.classList.toggle("is-visible", window.scrollY > 500);
  };

  window.addEventListener("scroll", toggleBackToTop, { passive: true });
  toggleBackToTop();

  backToTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
    });
  });
}
