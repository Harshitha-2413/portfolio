// reveal.js
(() => {
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const targets = [
    document.querySelector(".hero-left"),
    document.querySelector(".hero-right"),
    ...document.querySelectorAll(".section-head"),
    ...document.querySelectorAll(".card"),
  ].filter(Boolean);

  targets.forEach((el, i) => {
    el.classList.add("reveal");
    const isCard = el.classList.contains("card");
    const base = isCard ? 50 : 0;
    const step = isCard ? 70 : 0;
    el.style.setProperty("--d", `${base + (i % 8) * step}ms`);
  });

  if (prefersReduced) {
    targets.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
  );

  targets.forEach((el) => io.observe(el));
})();
