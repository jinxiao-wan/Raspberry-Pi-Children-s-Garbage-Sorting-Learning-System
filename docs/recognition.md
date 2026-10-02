# Optional live recognition

GitHub Pages serves static files and cannot keep a Baidu secret or run a recognition server. The public app therefore offers a recorded-example walkthrough and local photo preview with manual name lookup.

For a real local demonstration, use Node.js 22 or later and fresh Baidu image-recognition credentials. Set `BAIDU_API_KEY` and `BAIDU_SECRET_KEY` in the server’s environment, then run `npm start`. For example in PowerShell:

```powershell
$env:BAIDU_API_KEY = "your-own-api-key"
$env:BAIDU_SECRET_KEY = "your-own-secret-key"
npm start
```

Open `http://127.0.0.1:8080`. In Photo lab, choose a JPEG or PNG under 4 MB and explicitly click **Send to Baidu for recognition**. The image then leaves the device and is sent to Baidu. The app displays returned labels; choosing one triggers local dictionary lookup. Recognition or lookup can fail, so manual entry remains available.

The adapter obtains an OAuth client-credentials token and calls Baidu’s general object/scene recognition endpoint. Provider reference: [object recognition documentation](https://ai.baidu.com/ai-doc/IMAGERECOGNITION/Xk3bcxe21) and [authentication documentation](https://ai.baidu.com/ai-doc/REFERENCE/Lkru0zoz4).

No original keys are reused. If the archived keys belong to your account, revoke/rotate them because they were embedded in the source and report. The published repository removes them.

The server binds to `127.0.0.1`, has no image storage and does not enable CORS. It is a local demonstration tool. Hosting it publicly would require authentication, rate limits, HTTPS, provider-spending controls and a suitable image-handling policy. The adapter has unit tests with provider stubs; paid/live provider access is not validated in this reconstruction.
