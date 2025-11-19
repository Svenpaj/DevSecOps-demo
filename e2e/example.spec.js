// @ts-check
import { test, expect } from '@playwright/test';

test.describe('DevSecOps Demo Application', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the main page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle('DevSecOps 25 HAK Demo');
    await expect(page.locator('h1')).toHaveText('DevSecOps 25 HAK Demo');
    await expect(page.locator('p').first()).toHaveText('En enkel demo för GitHub Actions CI/CD');
  });

  test('should display initial status as N/A', async ({ page }) => {
    const statusDiv = page.locator('#status');
    await expect(statusDiv).toBeVisible();
    await expect(statusDiv).toContainText('Status:');
    await expect(statusDiv).toContainText('N/A');
  });

  test('should have health check button visible', async ({ page }) => {
    const healthButton = page.locator('button').filter({ hasText: 'Testa Health Check' });
    await expect(healthButton).toBeVisible();
  });

  test('should have load users button visible', async ({ page }) => {
    const loadUsersButton = page.locator('#load-users-btn');
    await expect(loadUsersButton).toBeVisible();
    await expect(loadUsersButton).toHaveText('Ladda användare');
  });
});

test.describe('Health Check API', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should perform successful health check', async ({ page }) => {
    const healthButton = page.locator('button').filter({ hasText: 'Testa Health Check' });
    await healthButton.click();

    // Wait for the result to appear
    const resultDiv = page.locator('#result');
    await expect(resultDiv).toBeVisible();

    // Check for success message
    await expect(resultDiv.locator('h3')).toHaveText('Health Check OK');
    
    // Verify status is updated
    const statusDiv = page.locator('#status');
    await expect(statusDiv).toContainText('Applikationen körs!');
  });

  test('should display health check data with correct structure', async ({ page }) => {
    const healthButton = page.locator('button').filter({ hasText: 'Testa Health Check' });
    await healthButton.click();

    const resultDiv = page.locator('#result');
    await expect(resultDiv).toBeVisible();

    // Check that the response contains expected fields
    const preElement = resultDiv.locator('pre');
    await expect(preElement).toBeVisible();
    
    const jsonText = await preElement.textContent();
    const healthData = JSON.parse(jsonText || '{}');
    
    expect(healthData).toHaveProperty('status', 'ok');
    expect(healthData).toHaveProperty('timestamp');
    expect(healthData).toHaveProperty('uptime');
    expect(healthData.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
  });

  test('should make actual API call to /api/health', async ({ page }) => {
    // Listen for API calls
    const [response] = await Promise.all([
      page.waitForResponse(response => response.url().includes('/api/health') && response.status() === 200),
      page.locator('button').filter({ hasText: 'Testa Health Check' }).click()
    ]);

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.status).toBe('ok');
  });
});

test.describe('Users API', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load and display users', async ({ page }) => {
    const loadUsersButton = page.locator('#load-users-btn');
    await loadUsersButton.click();

    // Wait for users to load
    const usersList = page.locator('#users-list');
    await expect(usersList).toBeVisible();

    // Check that user cards are displayed
    const userCards = page.locator('.user-card');
    await expect(userCards).toHaveCount(4);
  });

  test('should display correct user information', async ({ page }) => {
    const loadUsersButton = page.locator('#load-users-btn');
    await loadUsersButton.click();

    // Wait for users to load
    await page.waitForSelector('.user-card');

    // Check first user (John Doe)
    const firstUser = page.locator('.user-card').first();
    await expect(firstUser.locator('.user-name')).toHaveText('John Doe');
    await expect(firstUser.locator('.user-email')).toHaveText('john.doe@example.com');
    await expect(firstUser.locator('.user-age')).toHaveText('30 år');
    await expect(firstUser.locator('.user-role')).toHaveText('admin');
  });

  test('should display all users with correct data', async ({ page }) => {
    const loadUsersButton = page.locator('#load-users-btn');
    await loadUsersButton.click();

    await page.waitForSelector('.user-card');

    const userCards = page.locator('.user-card');
    const count = await userCards.count();
    expect(count).toBe(4);

    // Verify each user has required fields
    for (let i = 0; i < count; i++) {
      const card = userCards.nth(i);
      await expect(card.locator('.user-name')).toBeVisible();
      await expect(card.locator('.user-email')).toBeVisible();
      await expect(card.locator('.user-age')).toBeVisible();
      await expect(card.locator('.user-role')).toBeVisible();
    }
  });

  test('should show loading state before users load', async ({ page }) => {
    const loadUsersButton = page.locator('#load-users-btn');
    
    // Start loading
    await loadUsersButton.click();
    
    // Check for loading message (might be brief)
    const usersList = page.locator('#users-list');
    await expect(usersList).toBeVisible();
  });

  test('should make actual API call to /api/users', async ({ page }) => {
    const [response] = await Promise.all([
      page.waitForResponse(response => response.url().includes('/api/users') && response.status() === 200),
      page.locator('#load-users-btn').click()
    ]);

    expect(response.status()).toBe(200);
    const users = await response.json();
    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBe(4);
  });

  test('should display different user roles correctly', async ({ page }) => {
    const loadUsersButton = page.locator('#load-users-btn');
    await loadUsersButton.click();

    await page.waitForSelector('.user-card');

    // Check for admin role
    const adminRole = page.locator('.user-role.role-admin');
    await expect(adminRole).toBeVisible();
    await expect(adminRole).toHaveText('admin');

    // Check for user role
    const userRole = page.locator('.user-role.role-user').first();
    await expect(userRole).toBeVisible();
    await expect(userRole).toHaveText('user');

    // Check for moderator role
    const moderatorRole = page.locator('.user-role.role-moderator');
    await expect(moderatorRole).toBeVisible();
    await expect(moderatorRole).toHaveText('moderator');
  });
});

test.describe('API Direct Tests', () => {
  
  test('GET /api/health returns 200 with correct structure', async ({ request }) => {
    const response = await request.get('/api/health');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('status', 'ok');
    expect(data).toHaveProperty('timestamp');
    expect(data).toHaveProperty('uptime');
  });

  test('GET /api/users returns 200 with users array', async ({ request }) => {
    const response = await request.get('/api/users');
    expect(response.status()).toBe(200);
    
    const users = await response.json();
    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBeGreaterThan(0);
  });

  test('GET /api/users returns users with correct schema', async ({ request }) => {
    const response = await request.get('/api/users');
    const users = await response.json();
    
    // @ts-ignore - users is a dynamic array from API response
    users.forEach((user) => {
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('name');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('age');
      expect(user).toHaveProperty('role');
      expect(typeof user.id).toBe('number');
      expect(typeof user.name).toBe('string');
      expect(typeof user.email).toBe('string');
      expect(typeof user.age).toBe('number');
      expect(typeof user.role).toBe('string');
    });
  });
});


