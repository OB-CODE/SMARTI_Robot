// Main robot logic: the code that runs on the robot, motor speeds, and how drive commands are sent.

// ----- Runs ON the robot -----
// Uploaded every time you connect, because the robot forgets it when switched off.
// Uses your motor(left, right) function, which must already be on the robot.
const ROBOT_CODE = `
var stopTimer, lastL = 0, lastR = 0;
function drive(l, r) {
  if (l != lastL || r != lastR) { motor(l, r); lastL = l; lastR = r; }
  if (stopTimer) clearTimeout(stopTimer);
  stopTimer = setTimeout(function () { stopTimer = 0; lastL = lastR = 0; motor(0, 0); }, 500);
}
`;
// drive() only touches the motors when the speed changes (repeats just keep them running),
// and stops them by itself unless another drive() arrives within 500ms.

Connection.on("connect", () => Connection.upload(ROBOT_CODE));

// ----- Speeds -----
// [left, right] motor speed for each direction, from -1 (full reverse) to 1 (full forward)
const DIRECTIONS = {
  forward: [1, 1],
  back:    [-1, -1],
  left:    [-1, 1],
  right:   [1, -1],
};

// Turns start gently and speed up the longer the key is held, so a quick tap only nudges the robot round
const TURN_START = 0.4;   // turn speed on first press (0-1); lower = smaller minimum turn
const TURN_RAMP_MS = 600; // time to reach full turn speed

function speedFor(direction, heldMs) {
  const [l, r] = DIRECTIONS[direction];
  if (l === r) return [l, r]; // forward/back: full speed straight away
  const s = TURN_START + (1 - TURN_START) * Math.min(1, heldMs / TURN_RAMP_MS);
  return [+(l * s).toFixed(2), +(r * s).toFixed(2)];
}

// ----- Sending drive commands -----
let current = null, startedAt = 0, stopPending = false, sending = false;

// Only one command is ever in flight, so commands can't pile up in the Bluetooth queue.
// While a direction is held, a new drive() goes out 100ms after the previous one is delivered.
async function pump() {
  if (sending || !Connection.isConnected()) return;
  sending = true;
  try {
    while (current || stopPending) {
      const [l, r] = current ? speedFor(current, Date.now() - startedAt) : [0, 0];
      if (!current) stopPending = false;
      await Connection.send(`drive(${l},${r})`);
      if (current) await new Promise(res => setTimeout(res, 100));
    }
  } catch (e) {
    // connection dropped; the robot's timeout stops the motors
  } finally {
    sending = false;
  }
}

function startDriving(direction) {
  current = direction;
  startedAt = Date.now();
  pump();
}

function stopDriving() {
  current = null;
  stopPending = true; // stop right away; the robot's timeout is only a backup
  pump();
}
