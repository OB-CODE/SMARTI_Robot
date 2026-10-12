// Info pop-ups: menu buttons open the matching <dialog>; ✕, Esc or clicking outside closes it.
(() => {
  document.querySelectorAll("[data-open]").forEach(b => {
    b.onclick = () => document.getElementById(b.dataset.open).showModal();
  });
  document.querySelectorAll("dialog").forEach(d => {
    d.querySelector(".close").onclick = () => d.close();
    d.onclick = e => { if (e.target === d) d.close(); }; // click on the backdrop
  });
})();
