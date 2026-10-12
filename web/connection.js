// Bluetooth connection to the robot (via Espruino's uart.js), plus the Connect button and status display.
const Connection = (() => {
  const card = document.getElementById("card");
  const status = document.getElementById("status");
  const button = document.getElementById("connect");
  const listeners = { connect: [], disconnect: [] };

  // state: "off" | "connecting" | "on"
  let since = 0, clock = null;
  const setState = state => {
    card.className = "card " + state;
    clearInterval(clock);
    if (state === "off") {
      status.textContent = "Not connected";
      button.textContent = "Connect";
      listeners.disconnect.forEach(fn => fn());
    } else if (state === "connecting") {
      status.textContent = "Connecting…";
    } else {
      since = Date.now();
      const tick = () => {
        const s = Math.floor((Date.now() - since) / 1000);
        status.textContent = `Connected · ${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
      };
      tick();
      clock = setInterval(tick, 1000);
      button.textContent = "Disconnect";
    }
  };

  button.onclick = () => {
    if (UART.isConnected()) return UART.close(); // 'close' handler resets the display
    setState("connecting");
    UART.write("\x10\n") // opens the device picker and connects
      .then(() => {
        const c = UART.getConnection();
        if (!c) throw "not connected";
        c.on("close", () => setState("off"));
        return Promise.all(listeners.connect.map(fn => fn()));
      })
      .then(() => setState("on"))
      .catch(() => setState("off")); // e.g. device picker cancelled
  };

  return {
    isConnected: () => UART.isConnected(),

    // Run on("connect", fn) / on("disconnect", fn). A connect handler can return a promise to finish before "Connected" shows.
    on: (event, fn) => listeners[event].push(fn),

    // Run one line of code on the robot. Doesn't wait for a reply, so it's fast enough to call repeatedly.
    send: cmd => UART.write(`\x10${cmd}\n`, { noWait: true }),

    // Upload a block of code to the robot. \x10 on each line stops the robot echoing it back.
    upload: code => UART.write(code.trim().split("\n").map(line => "\x10" + line).join("\n") + "\n"),
  };
})();
