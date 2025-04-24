import { defineConfig } from 'cypress';
import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__dirname),
    baseUrl: 'http://localhost:4200',
    supportFile: 'src/support/e2e.ts',
    specPattern: 'src/e2e/**/*.cy.{js,jsx,ts,tsx}',
    fixturesFolder: 'src/fixtures',
    videosFolder: '../dist/cypress/e2e/videos',
    screenshotsFolder: '../dist/cypress/e2e/screenshots'
  }
});
