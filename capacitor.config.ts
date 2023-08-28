import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'votapp-app',
  webDir: 'www',
  bundledWebRuntime: false,
  server: {
    "androidScheme": 'http',
    allowNavigation: ["localhost:8080"],
    "cleartext": true
  }
};

export default config;
