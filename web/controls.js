// Keyboard and on-screen buttons: turns presses into startDriving/stopDriving and highlights the held button.
(() => {
  const KEYS = {
    ArrowUp: "forward",
    ArrowDown: "back",
    ArrowLeft: "left",
    ArrowRight: "right",
  };
  const buttons = {};
  document.querySelectorAll(".pad button").forEach(b => buttons[b.dataset.direction] = b);
  let held = null;

  const press = direction => {
    if (held) buttons[held].classList.remove("active");
    held = direction;
    buttons[direction].classList.add("active");
    startDriving(direction);
  };
  const release = direction => {
    if (!held || (direction && direction !== held)) return;
    buttons[held].classList.remove("active");
    held = null;
    stopDriving();
  };

  document.onkeydown = e => {
    if (!KEYS[e.key] || document.querySelector("dialog[open]")) return; // arrows scroll pop-ups, not drive
    e.preventDefault();
    if (!e.repeat) press(KEYS[e.key]);
  };
  document.onkeyup = e => { if (KEYS[e.key]) release(KEYS[e.key]); };
  window.onblur = () => release();
  Connection.on("disconnect", () => release());

  Object.entries(buttons).forEach(([direction, b]) => {
    b.onpointerdown = e => { e.preventDefault(); press(direction); };
    b.onpointerup = b.onpointerleave = b.onpointercancel = () => release(direction);
    b.oncontextmenu = e => e.preventDefault();
  });
})();
