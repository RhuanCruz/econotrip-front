import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'econotrip.collabyt.com',
  appName: 'Econotrip PrimeVoyage',
  webDir: 'dist',
  plugins: {
    Keyboard: {
      resize: 'body', // or 'body' or 'native'
      style: 'dark',
      resizeOnFullScreen: true,
    },
  }
};

export default config;
