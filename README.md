# Bushel for Expo Go

This project contains two modes:

- **Preview:** a native React Native app for testing farm layouts, bins and grain-cart loads. It has separate, phone-local data and works without an internet connection after the Expo bundle has loaded. Preview changes never update the live Bushel site.
- **Connected:** the existing Bushel site displayed inside the app using a WebView. Once authenticated, it uses the site's existing database and all current site features. This is a live website view, not a native API integration. It needs internet access.

## Start on Windows / VS Code

1. Download and extract `Bushel-Expo.zip` to a new folder, separate from ELEV8 and the Bushel website.
2. Open the extracted **Bushel-Expo** folder in VS Code. Make sure `package.json` and `App.js` are visible in that folder.
3. Open **Terminal → New Terminal** and run:

```powershell
npm install
npx expo start
```

4. Update Expo Go on your iPhone. Keep the phone and computer on the same Wi-Fi network. Scan the terminal's QR code with your iPhone Camera and open it in Expo Go.
5. Choose **Preview** or **Connected** at the top of the app.

If the QR code won't connect, stop the server with Ctrl+C and try:

```powershell
npx expo start --tunnel
```

Expo may ask to install its tunnel helper. Leave the terminal running while testing. This download is source code; it is not a QR code, TestFlight build or App Store installation.

## Test the preview

- Start with two empty example bins and a shed. No real farm loads are included.
- Open Grain Cart, choose a crop and bin, enter a weight and save.
- Open Grain Bins, tap a bin in the diagram and see its weight, bushels and capacity.
- Edit the saved load in Grain Cart. Changing its destination updates both bins.
- Open Settings to add numbered bins, circles and rectangles; edit size, position, colour and rotation. Drag saved shapes to reposition them.
- Bins with assigned loads cannot be deleted. Reassign their loads first.
- Preview data is stored with AsyncStorage under `bushel-expo-preview-v1`. Removing app/project storage can remove it. There is no synchronization or import into the live farm.
- A saved layout is read-only on the Grain Bins page. View in / View out / Fit buttons control zoom.

## Connect to your live Bushel site

Choose **Connected**, then sign in to the existing site if prompted. The site remains at:

https://bushel-farm-home.ethanpen06.chatgpt.site

Live changes affect the real farm data, just as on the website. Preview changes do not.

**Authentication limitation:** the Expo bundle was checked, but ChatGPT sign-in inside the iPhone WebView has not been device-tested. Some sign-in providers reject embedded browsers. If sign-in fails or loops, use **Open Safari** to use the live site in Safari. Signing into Safari does not necessarily sign into this WebView. A fully native connected mode would require a dedicated mobile authentication/API integration, which this package does not implement. No credentials or site bypass tokens are bundled.

## Project files

- `App.js`: native screens, settings diagram, connected WebView.
- `model.js`: preview validation, totals, persistence format and isolated test state.
- `assets/`: the supplied Bushel logo and farm images.
- `app.json`: Expo application configuration.
- `package.json` and `package-lock.json`: tested dependency set.

The project uses the Expo blank template, without Expo Router or React Navigation. Expo SDK 57 was the current template used when packaged. Run `npx expo install --check` to check library compatibility.

If adding the preview libraries to another compatible Expo project, use:

```powershell
npx expo install react-native-webview @react-native-async-storage/async-storage react-native-safe-area-context
```

For an iPhone simulator on macOS, use `npm run ios`. Windows cannot run the iOS simulator; use the physical iPhone with Expo Go.

## Validation

The iOS JavaScript bundle was exported successfully. Preview model checks covered load edits, bin reassignment, inventory totals, shape changes, protected bin deletion and saved-data round trips. Physical iPhone UI and connected sign-in still require device testing.
