# Running the Recipe Manufacturing App with Expo

This guide provides instructions for running the Recipe Manufacturing App using Expo.

## Prerequisites

1. Node.js (v16 or later)
2. npm or yarn
3. Expo CLI: `npm install -g expo-cli`
4. Expo Go app on your mobile device (available on iOS App Store or Google Play Store)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the Expo development server:
```bash
npm start
```

3. Use the Expo Go app on your mobile device to scan the QR code displayed in the terminal or in Expo Dev Tools.

## Troubleshooting

### Module Resolution Issues

If you encounter module resolution errors, try the following:

1. Clear the Metro bundler cache:
```bash
expo start -c
```

2. Make sure all dependencies are properly installed:
```bash
npm install
```

3. Update Expo SDK:
```bash
expo upgrade
```

### AsyncStorage Issues

If you encounter AsyncStorage-related errors:

1. Make sure you're using `@react-native-async-storage/async-storage` correctly
2. Note that AsyncStorage doesn't support storage events like browser's localStorage

### Splash Screen and Icons

We've configured the splash screen and icons in app.json:

- Splash screen: Uses a red (#FF6B6B) background with the app logo
- Icons: Standard Expo icon configuration for iOS, Android, and web

## Testing the App

You can test the app using these credentials:
- Email: test@example.com
- Password: password

## Building for Production

To create a production build:

1. For Android:
```bash
expo build:android
```

2. For iOS:
```bash
expo build:ios
```

Note that you'll need an Expo account and appropriate credentials for building native apps. 