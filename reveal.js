(() => {
  // Reveal animation
  const items = document.querySelectorAll(".reveal");
  if (items.length) {
    const show = (el) => el.classList.add("is-visible");

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      items.forEach(show);
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              show(entry.target);
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
      );

      items.forEach((el) => io.observe(el));
    }
  }

  // Interactive scroll beads
  (function () {
    const holder = document.getElementById("scrollBeads");
    if (!holder) return;

    const targets = [
      { id: "top", label: "Home" },
      { id: "work", label: "Projects" },
      { id: "hackathons", label: "Hackathons" },
      { id: "experience", label: "Experience" },
      { id: "skills", label: "Skills" },
      { id: "beyond", label: "Interests" },
      { id: "contact", label: "Get in touch" },
    ];

    const colors = ["#34d7c5", "#1ea89f", "#7cf0d8", "#0f6f7a"];

    holder.innerHTML = "";

    const buttons = targets.map((t, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "bead-btn";
      btn.setAttribute("data-target", `#${t.id}`);
      btn.setAttribute("data-label", t.label);
      btn.setAttribute("aria-label", `Go to ${t.label}`);

      const dot = document.createElement("span");
      dot.className = "bead-dot";
      dot.style.setProperty("--bead", colors[i % colors.length]);

      btn.appendChild(dot);
      holder.appendChild(btn);

      btn.addEventListener("click", () => {
        const el = document.getElementById(t.id);
        if (!el) return;
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      });

      return btn;
    });

    const sections = targets.map((t) => document.getElementById(t.id)).filter(Boolean);

    function setActive(id) {
      buttons.forEach((b) => b.classList.remove("is-active"));
      const idx = targets.findIndex((t) => t.id === id);
      if (idx >= 0) buttons[idx].classList.add("is-active");
    }

    setActive("top");

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const spy = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0))[0];

        if (visible?.target?.id) setActive(visible.target.id);
      },
      { threshold: [0.18, 0.28, 0.38], rootMargin: "-10% 0px -55% 0px" }
    );

    sections.forEach((s) => spy.observe(s));
  })();

  // Custom cursor (dot + ring)
  (function () {
    const dot = document.querySelector(".cursor-dot");
    const ring = document.querySelector(".cursor-ring");
    if (!dot || !ring) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let rx = x;
    let ry = y;

    const hoverSelector = "a, button, .bead-btn, .bubble, .action-btn, .btn, .icon-btn, label";

    function onMove(e) {
      x = e.clientX;
      y = e.clientY;
      dot.style.left = `${x}px`;
      dot.style.top = `${y}px`;
    }

    function loop() {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      ring.style.left = `${rx}px`;
      ring.style.top = `${ry}px`;
      requestAnimationFrame(loop);
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    loop();

    document.addEventListener("mouseover", (e) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      if (target.closest(hoverSelector)) ring.classList.add("is-hover");
    });

    document.addEventListener("mouseout", (e) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      if (target.closest(hoverSelector)) ring.classList.remove("is-hover");
    });

    window.addEventListener("mousedown", () => ring.classList.add("is-down"));
    window.addEventListener("mouseup", () => ring.classList.remove("is-down"));
  })();
})();
