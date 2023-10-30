import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ezactive.ezleague',
  appName: 'EZ League',
  webDir: 'dist/build',
  bundledWebRuntime: false,
  ios: {
    contentInset: 'always',
  },
  plugins: {
    CapacitorUpdater: {
      autoUpdate: false,
    },
  },
};

export default config;
