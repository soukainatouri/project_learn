import { chromium } from 'playwright';
import path from 'path';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Create an absolute path URL to the html file
  const filePath = `file://${path.resolve('project_report.html')}`;
  
  await page.goto(filePath, { waitUntil: 'networkidle' });
  
  await page.pdf({
    path: 'project_report.pdf',
    format: 'A4',
    printBackground: true,
    margin: {
      top: '20px',
      bottom: '20px',
      left: '20px',
      right: '20px'
    }
  });

  await browser.close();
  console.log('PDF generated successfully!');
})();
