const dots = [...document.querySelectorAll(".section-dot")];
const revealTargets = [...document.querySelectorAll("[data-reveal]")];
const printButton = document.getElementById("printButton");
const backToTopButton = document.getElementById("backToTop");

const sectionEntries = dots.map((dot) => {
  const id = dot.getAttribute("href");
  if (!id || !id.startsWith("#")) return null;
  const section = document.querySelector(id);
  return section ? { dot, section, id } : null;
}).filter(Boolean);

const setActiveDot = (id) => {
  sectionEntries.forEach(({ dot, id: sectionId }) => {
    const isActive = sectionId === id;
    dot.classList.toggle("is-active", isActive);
    if (isActive) dot.setAttribute("aria-current", "true");
    else dot.removeAttribute("aria-current");
  });
};

dots.forEach((dot) => {
  dot.addEventListener("click", (e) => {
    const href = dot.getAttribute("href");
    if (!href || !href.startsWith("#")) return;
    const target = document.getElementById(href.slice(1));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "start"
    });
  });
});

const getNearestSectionId = () => {
  const viewportAnchor = window.innerHeight * 0.42;
  let nearest = sectionEntries[0];
  let nearestDistance = Number.POSITIVE_INFINITY;

  sectionEntries.forEach((item) => {
    const rect = item.section.getBoundingClientRect();
    const sectionAnchor = rect.top + Math.min(rect.height * 0.35, 180);
    const distance = Math.abs(sectionAnchor - viewportAnchor);

    if (distance < nearestDistance) {
      nearest = item;
      nearestDistance = distance;
    }
  });

  return nearest ? nearest.id : null;
};

const updateActiveSection = () => {
  const id = getNearestSectionId();
  if (id) setActiveDot(id);
};

if (sectionEntries.length) {
  window.addEventListener("scroll", updateActiveSection, { passive: true });
  window.addEventListener("resize", updateActiveSection, { passive: true });
  updateActiveSection();
}

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

const sectionRail = document.querySelector(".section-rail");

if (sectionRail) {
  let idleTimer;

  const showRail = () => {
    sectionRail.classList.remove("is-idle");
  };

  const scheduleRailIdle = () => {
    window.clearTimeout(idleTimer);
    idleTimer = window.setTimeout(() => {
      sectionRail.classList.add("is-idle");
    }, 1000);
  };

  const refreshRailVisibility = () => {
    showRail();
    scheduleRailIdle();
  };

  window.addEventListener("scroll", refreshRailVisibility, { passive: true });
  sectionRail.addEventListener("mouseenter", showRail);
  sectionRail.addEventListener("mouseleave", scheduleRailIdle);

  refreshRailVisibility();
}
