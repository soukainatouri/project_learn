import { test, expect } from '@playwright/test';

test('fill and submit the situation generation form', async ({ page }) => {
  // Navigate to the app
  await page.goto('/');

  // Log in with credentials
  await page.fill('input[type="email"]', 'loebalonso@gmail.com');
  await page.fill('input[type="password"]', '12345678');
  await page.getByRole('button', { name: 'دخول' }).click();

  // Wait for the home page to load
  await expect(page.getByRole('link', { name: 'بدء الصياغة' })).toBeVisible({ timeout: 10000 });

  // Click the start link on the home page
  await page.getByRole('link', { name: 'بدء الصياغة' }).click();

  // Fill text inputs
  await page.fill('input[name="lessonTitle"]', 'القسمة الإقليدية');
  await page.fill('input[name="targetLearnings"]', 'تعرف وتوظيف خوارزمية القسمة الإقليدية');
  await page.fill('input[name="educationalObjectives"]', 'أن يتمكن المتعلم من إنجاز عملية قسمة بتوظيف التقنية الاعتيادية');
  await page.fill('input[name="mathResources"]', 'جدول الضرب، الطرح، المقارنة');
  await page.fill('input[name="contextDescription"]', 'توزيع جوائز مسابقة على مجموعة من التلاميذ بالتساوي');
  await page.fill('input[name="taskRequired"]', 'حساب نصيب كل تلميذ والباقي');
  await page.fill('input[name="finalProduct"]', 'عملية قسمة صحيحة مع تحديد الخارج والباقي');
  await page.fill('input[name="priorKnowledge"]', 'إتقان جدول الضرب');
  await page.fill('input[name="requiredSkills"]', 'إنجاز الطرح والمقارنة بدقة');
  await page.fill('input[name="numericData"]', '458 جائزة على 12 تلميذاً');

  // Select Radios
  await page.getByText('الخامس', { exact: true }).click();
  await page.getByText('الأعداد والحساب', { exact: true }).click();
  await page.getByText('بناء تعلم جديد', { exact: true }).click();
  await page.getByText('رحلة مدرسية', { exact: true }).click();
  await page.getByText('وضعية بناء التعلم', { exact: true }).click();
  await page.getByText('متوسطة', { exact: true }).click();
  await page.getByText('ثنائي', { exact: true }).click();
  await page.getByText('متوسطة (6–10 أسطر)', { exact: true }).click();
  await page.getByText('عربية مبسطة', { exact: true }).click();

  // Select Checkboxes
  await page.getByText('معطيات زائدة', { exact: true }).click();
  await page.getByText('الدرهم', { exact: true }).click();

  // Submit form
  await page.getByRole('button', { name: 'إنشاء الوضعية المشكلة' }).click();

  // Stop the automation here so you can interact with the results yourself
  await page.pause();
});
