(() => {
  const root = document.documentElement;
  const themeToggle = document.getElementById("themeToggle");
  const resumeBtn = document.getElementById("resumeBtn");

  const setTheme = (mode) => {
    const isLight = mode === "light";
    if (isLight) root.setAttribute("data-theme", "light");
    else root.removeAttribute("data-theme");

    if (themeToggle) {
      themeToggle.checked = isLight;
      themeToggle.setAttribute("aria-checked", String(isLight));
    }
  };

  // Start dark by default, but respect saved choice if it exists
  const stored = localStorage.getItem("theme");
  if (stored === "light") setTheme("light");
  else setTheme("dark");

  themeToggle?.addEventListener("change", (e) => {
    const checked = Boolean(e.target.checked);
    const mode = checked ? "light" : "dark";
    setTheme(mode);
    localStorage.setItem("theme", mode);
  });

  function downloadBlob(filename, content, mime = "text/plain") {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  resumeBtn?.addEventListener("click", () => {
    const text =
      `Please contact me and I will share my resume:\n\n` +
      `Email: barataha@mail.uc.edu\n\n` +
      `Thank you.\n`;

    downloadBlob("CONTACT_ME_FOR_RESUME.txt", text);
  });
})();
