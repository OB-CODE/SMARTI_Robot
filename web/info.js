// Info side panel: a menu button shows its section; the same button, ✕ or Esc hides it.
(() => {
  const drawer = document.getElementById("drawer");
  const menu = document.querySelectorAll("[data-open]");
  let current = null;

  const show = id => {
    current = id;
    drawer.hidden = !id;
    document.body.classList.toggle("drawer-open", !!id);
    drawer.querySelectorAll("section").forEach(s => s.hidden = s.id !== id);
    menu.forEach(b => b.setAttribute("aria-pressed", b.dataset.open === id));
    if (id) drawer.scrollTop = 0;
  };

  menu.forEach(b => b.onclick = () => show(current === b.dataset.open ? null : b.dataset.open));
  drawer.querySelectorAll(".close").forEach(b => b.onclick = () => show(null));
  document.addEventListener("keydown", e => { if (e.key === "Escape") show(null); });

  // Board tour: ← / → step through the pin groups, highlighting each in the diagram
  const tour = document.getElementById("tour");
  const steps = tour.querySelectorAll(".step");
  const groups = tour.querySelectorAll(".grp");
  const dots = tour.querySelector(".dots");
  const prev = tour.querySelector(".prev"), next = tour.querySelector(".next");
  steps.forEach((_, i) => {
    const d = document.createElement("button");
    d.setAttribute("aria-label", "Step " + (i + 1));
    d.onclick = () => goTo(i);
    dots.append(d);
  });
  let step = 0;
  const goTo = i => {
    step = i;
    steps.forEach((s, j) => s.hidden = j !== i);
    const show = steps[i].dataset.show.split(" ");
    groups.forEach(g => g.classList.toggle("on", show.includes(g.dataset.group)));
    dots.querySelectorAll("button").forEach((d, j) => d.setAttribute("aria-current", j === i));
    prev.disabled = i === 0;
    next.disabled = i === steps.length - 1;
  };
  prev.onclick = () => goTo(step - 1);
  next.onclick = () => goTo(step + 1);
  goTo(0);

  // Palette swatches, read from the CSS variables at the top of style.css
  const PALETTE = ["white", "paper", "ash", "charcoal", "ink", "clay"];
  const css = getComputedStyle(document.documentElement);
  document.getElementById("swatches").innerHTML = PALETTE.map(name => {
    const hex = css.getPropertyValue("--" + name).trim();
    return `<li><span class="chip" style="background:${hex}"></span>${name}<code>${hex}</code></li>`;
  }).join("");
})();
