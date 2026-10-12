// Info pop-ups: menu buttons open the matching <dialog>; ✕, Esc or clicking outside closes it.
(() => {
  document.querySelectorAll("[data-open]").forEach(b => {
    b.onclick = () => document.getElementById(b.dataset.open).showModal();
  });
  document.querySelectorAll("dialog").forEach(d => {
    d.querySelector(".close").onclick = () => d.close();
    d.onclick = e => { if (e.target === d) d.close(); }; // click on the backdrop
  });

  // Palette swatches, read from the CSS variables at the top of style.css
  const PALETTE = ["paper", "white", "sand", "stone", "ash", "charcoal", "graphite", "night", "ink", "cream", "terracotta", "clay"];
  const css = getComputedStyle(document.documentElement);
  document.getElementById("swatches").innerHTML = PALETTE.map(name => {
    const hex = css.getPropertyValue("--" + name).trim();
    return `<li><span class="chip" style="background:${hex}"></span>${name}<code>${hex}</code></li>`;
  }).join("");
})();
