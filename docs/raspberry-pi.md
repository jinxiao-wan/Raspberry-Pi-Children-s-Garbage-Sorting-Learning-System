# Raspberry Pi browser deployment

The original project title mentions Raspberry Pi, but the supplied implementation documents a WeChat mini program. This guide describes a new way to display the rebuilt app on a Pi with a desktop browser. It is not evidence of original GPIO or hardware work.

The simplest option is to open the GitHub Pages app in the Pi’s browser and use full-screen mode. Visit once while online so the offline worker can cache the app.

Alternatively, copy this repository to a Pi with Node.js 22 or later and run:

```bash
npm start
```

Open `http://127.0.0.1:8080` on the Pi. No GPIO, motor, sensor or camera-module library is required for the game/search/demo. The native browser file picker may expose a camera only if supported by the device/browser. A Pi CSI camera is not integrated by this reconstruction.

For a classroom terminal, the game supports both touch bin buttons and desktop drag/drop. The best score belongs to that browser/device; there are no student accounts or remote rankings. Live Baidu recognition is optional and needs internet access and fresh server-side credentials.
