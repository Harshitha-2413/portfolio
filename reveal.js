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

  // Custom cursor: sparkle trail
  (function () {
    const layer = document.querySelector(".sparkle-layer");
    if (!layer) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touch = window.matchMedia("(hover: none)").matches;
    if (reduce || touch) return;

    let lastX = -9999;
    let lastY = -9999;
    let lastT = 0;

    const minDist = 10; // px
    const minDelay = 22; // ms

    function dist(a, b, c, d) {
      const dx = a - c;
      const dy = b - d;
      return Math.sqrt(dx * dx + dy * dy);
    }

    function spawn(x, y, intensity = 1) {
      const s = document.createElement("span");
      s.className = "sparkle";

      // Small randomness so it feels alive but not chaotic
      const size = (8 + Math.random() * 6) * intensity;
      const rot = 25 + Math.random() * 60;
      const dur = 520 + Math.random() * 240;

      s.style.width = `${size}px`;
      s.style.height = `${size}px`;
      s.style.left = `${x}px`;
      s.style.top = `${y}px`;
      s.style.animationDuration = `${dur}ms`;
      s.style.transform = `translate(-50%, -50%) rotate(${rot}deg)`;

      layer.appendChild(s);
      s.addEventListener("animationend", () => s.remove(), { once: true });
    }

    const hoverSelector =
      "a, button, .bead-btn, .bubble, .action-btn, .btn, .icon-btn, label";
    let hovering = false;

    document.addEventListener("mouseover", (e) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      hovering = Boolean(t.closest(hoverSelector));
    });

    document.addEventListener("mouseout", (e) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      if (t.closest(hoverSelector)) hovering = false;
    });

    window.addEventListener(
      "mousemove",
      (e) => {
        const now = performance.now();
        const x = e.clientX;
        const y = e.clientY;

        if (now - lastT < minDelay) return;
        if (dist(x, y, lastX, lastY) < minDist) return;

        lastT = now;
        lastX = x;
        lastY = y;

        spawn(x, y, hovering ? 1.08 : 1);
      },
      { passive: true }
    );
  })();
})();
