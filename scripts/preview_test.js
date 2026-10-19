const { chromium } = require('playwright');
const path = require('path');

(async () => {
  console.log('Iniciando navegador local Chromium...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const consoleLogs = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleLogs.push(`[ERROR] ${msg.text()}`);
    }
  });

  page.on('pageerror', err => {
    consoleLogs.push(`[PAGE ERROR] ${err.message}`);
  });

  const localFile = 'file:///' + path.resolve(__dirname, '../index.html').replace(/\\/g, '/');
  console.log('Cargando:', localFile);
  await page.goto(localFile, { waitUntil: 'networkidle' });

  const title = await page.title();
  console.log('Título de la página:', title);

  const screenshotPath = path.resolve(__dirname, '../preview.png');
  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log('Captura de pantalla guardada en:', screenshotPath);

  if (consoleLogs.length > 0) {
    console.log('Errores detectados en consola:', consoleLogs);
  } else {
    console.log('¡Previsualización exitosa sin errores de consola!');
  }

  await browser.close();
  process.exit(0);
})();
