// theme.js
(() => {
  const root = document.documentElement;
  const btn = document.getElementById("modeToggle");
  if (!btn) return;

  const saved = localStorage.getItem("theme");
  if (saved === "chill") {
    root.setAttribute("data-theme", "chill");
    btn.setAttribute("aria-pressed", "true");
  }

  btn.addEventListener("click", () => {
    const isChill = root.getAttribute("data-theme") === "chill";
    if (isChill) {
      root.removeAttribute("data-theme");
      localStorage.setItem("theme", "classy");
      btn.setAttribute("aria-pressed", "false");
    } else {
      root.setAttribute("data-theme", "chill");
      localStorage.setItem("theme", "chill");
      btn.setAttribute("aria-pressed", "true");
    }
  });
})();
