import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  appName: 'allaboutastro',
  brand: {
    displayName: '점성술 연구소',
    primaryColor: '#6366f1',
    icon: '',
  },
  web: {
    host: 'localhost',
    port: 8080,
    commands: {
      dev: 'vite',
      build: 'vite build',
    },
  },
  permissions: [],
  webViewProps: {
    type: 'partner',
  },
});
