# SMARTI Robot

Getting started with the [Espruino Smartibot](https://www.espruino.com/Smartibot).

## Connect

1. Open the [Espruino Web IDE with Smartibot blocks](https://espruino.github.io/EspruinoWebIDE/?settings=%7B%22BLOCKLY_EXTENSIONS%22%3A%22%7Csmartibot%7C%22%7D) in Chrome.
2. Turn the robot on, click the connect icon (top left), choose **Web Bluetooth**, and pick **Espruino SMARTIBOT**.
3. If prompted with *"Looks like you're using Smartibot!"*, click **Click here** to enable the Smartibot Blockly blocks.

## Try it in the console

```js
var smarti = require("Smartibot");
smarti.setMotor(1, 1);  // motor 1..4, speed -1..1
smarti.setMotor(2, 1);
// stop
smarti.setMotor(1, 0);
smarti.setMotor(2, 0);
```

## Try it with blocks

Open a new `.xml` tab, go to **Robot**, and drag in:

```
repeat 1 times
  do: Forward 1 seconds
```

Click the upload button to send it to the robot.
