import { test, expect } from '@playwright/test';

// Configuration for human-like behavior
test.use({
  launchOptions: {
    slowMo: 200, // Small base slowdown for general interactions
  },
});

// Helper for human-like random pauses
const humanPause = async (page, min = 500, max = 1500) => {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  await page.waitForTimeout(delay);
};

// Helper for human-like typing
const humanType = async (page, selector, text) => {
  const locator = page.locator(selector);
  await locator.click(); // Click the input first
  await humanPause(page, 200, 500); // Pause before starting to type
  
  // Typing speed around ~80ms per key (which is a realistic typing speed)
  await locator.pressSequentially(text, { delay: Math.floor(Math.random() * 50) + 50 });
  await humanPause(page, 300, 800); // Pause after typing
};

// Helper for human-like smooth scrolling
const humanScroll = async (page, pixels = 300) => {
  await page.evaluate((px) => {
    window.scrollBy({ top: px, behavior: 'smooth' });
  }, pixels);
  await humanPause(page, 1500, 2500); // Pause to read the new content scrolled into view
};

test('Human-like Flow: Auth and Form Filling', async ({ page }) => {
  // Extra time since human typing is much slower than automation
  test.setTimeout(180000); 

  await page.goto('http://localhost:5173/');
  await humanPause(page, 1500, 2500);

  // ==========================================
  // 1. Test Creating a User
  // ==========================================
  console.log("Testing human-like user creation...");
  await page.getByRole('button', { name: 'ليس لديك حساب؟ قم بإنشاء واحد' }).click();
  await humanPause(page, 1000, 2000);
  
  const testEmail = `user${Date.now()}@example.com`;
  await humanType(page, 'input[type="email"]', testEmail);
  await humanType(page, 'input[type="password"]', 'TestPass123!');
  
  await humanPause(page, 500, 1000);
  await page.getByRole('button', { name: 'تسجيل', exact: true }).click();
  
  // Handle auto-login
  const authMessage = page.locator('.auth-message');
  const logoutBtn = page.locator('.logout-btn');
  
  await expect(authMessage.or(logoutBtn)).toBeVisible({ timeout: 15000 });
  await humanPause(page, 2000, 3000); // Read the message or navbar
  
  if (await logoutBtn.isVisible()) {
    await logoutBtn.click();
    await humanPause(page, 1500, 2500);
  } else {
    await page.getByRole('button', { name: 'لديك حساب بالفعل؟ قم بتسجيل الدخول' }).click();
    await humanPause(page, 1500, 2500);
  }

  // ==========================================
  // 2. Test Wrong Login
  // ==========================================
  console.log("Testing human-like wrong login...");
  await humanType(page, 'input[type="email"]', 'wrong@example.com');
  await humanType(page, 'input[type="password"]', 'wrongpassword');
  
  await humanPause(page, 500, 1000);
  await page.getByRole('button', { name: 'دخول', exact: true }).click();
  
  await expect(page.locator('.auth-message')).toBeVisible({ timeout: 15000 });
  await humanPause(page, 3000, 4500); // Human reading the Arabic error message

  // Clear inputs before re-typing
  await page.locator('input[type="email"]').fill('');
  await page.locator('input[type="password"]').fill('');
  await humanPause(page, 800, 1200);

  // ==========================================
  // 3. Test Right Login
  // ==========================================
  console.log("Testing human-like right login...");
  await humanType(page, 'input[type="email"]', 'loebalonso@gmail.com');
  await humanType(page, 'input[type="password"]', '12345678');
  
  await humanPause(page, 500, 1000);
  await page.getByRole('button', { name: 'دخول', exact: true }).click();

  const startButton = page.getByRole('link', { name: 'بدء الصياغة' });
  await expect(startButton).toBeVisible({ timeout: 15000 });
  await humanPause(page, 2000, 3000);

  // ==========================================
  // 4. Test Form Filling
  // ==========================================
  console.log("Testing human-like form filling...");
  await startButton.click();
  await humanPause(page, 2000, 3000); // Look at the newly opened form

  // Section 1
  await humanType(page, 'input[name="lessonTitle"]', 'القسمة الإقليدية');
  await page.getByText('الخامس', { exact: true }).click();
  await humanPause(page, 600, 1200);
  await page.getByText('الأعداد والحساب', { exact: true }).click();
  
  await humanScroll(page, 400);

  // Section 2
  await humanType(page, 'input[name="educationalObjectives"]', 'أن يتمكن المتعلم من إنجاز عملية قسمة بتوظيف التقنية الاعتيادية');
  await page.getByText('بناء تعلم جديد', { exact: true }).click();
  await humanPause(page, 600, 1200);
  await humanType(page, 'input[name="mathResources"]', 'جدول الضرب، الطرح، المقارنة');
  
  await humanScroll(page, 400);

  // Section 3
  await page.getByText('رحلة مدرسية', { exact: true }).click();
  await humanPause(page, 600, 1200);
  await humanType(page, 'input[name="contextDescription"]', 'توزيع جوائز مسابقة على مجموعة من التلاميذ بالتساوي');
  
  await humanScroll(page, 400);

  // Section 4
  await page.getByText('متوسطة', { exact: true }).click(); 
  await humanPause(page, 600, 1200);
  await page.getByText('معطيات زائدة', { exact: true }).click();
  
  await humanScroll(page, 400);

  // Section 5
  await humanType(page, 'input[name="taskRequired"]', 'حساب نصيب كل تلميذ والباقي');
  await page.getByText('ثنائي', { exact: true }).click();
  
  await humanScroll(page, 400);

  // Section 6 & 7
  await humanType(page, 'input[name="priorKnowledge"]', 'إتقان جدول الضرب');
  await humanScroll(page, 300);
  await humanType(page, 'input[name="numericData"]', '458 جائزة على 12 تلميذاً');
  await page.getByText('الدرهم', { exact: true }).click();
  
  await humanScroll(page, 400);

  // Section 8
  await page.getByText('متوسطة (6–10 أسطر)', { exact: true }).click();
  await humanPause(page, 600, 1200);
  await page.getByText('عربية مبسطة', { exact: true }).click();
  
  await humanScroll(page, 200);

  // Final review before clicking submit
  await humanPause(page, 3000, 4500);
  
  // Submit form
  await page.getByRole('button', { name: 'إنشاء الوضعية المشكلة' }).click();

  // Wait for generation to complete so the screen recording has a nice ending
  console.log("Waiting for situation generation to finish...");
  await expect(page.getByRole('heading', { name: 'الوضعيات المقترحة' })).toBeVisible({ timeout: 45000 });
  
  // Pause to let the user read the final generated situations
  await humanPause(page, 5000, 7000);

  // Pause Playwright indefinitely so the browser stays open for manual interaction
  console.log("Pausing execution. You can now take over the browser!");
  await page.pause();
});
