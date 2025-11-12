import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load users from JSON file
export function loadUsers() {
  const filePath = path.join(__dirname, '..', 'data', 'users.json');
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
}

// Find user by ID
export function findUserById(users, id) {
  return users.find(user => user.id === id);
}

// Find users by role
export function findUsersByRole(users, role) {
  return users.filter(user => user.role === role);
}

// Get users older than specified age
export function getUsersOlderThan(users, age) {
  return users.filter(user => user.age > age);
}

// Validate email format
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Calculate average age
export function calculateAverageAge(users) {
  if (users.length === 0) return 0;
  const totalAge = users.reduce((sum, user) => sum + user.age, 0);
  return totalAge / users.length;
}

// Get user statistics
export function getUserStatistics(users) {
  const roleCount = {};
  let totalAge = 0;
  
  users.forEach(user => {
    // Count roles
    roleCount[user.role] = (roleCount[user.role] || 0) + 1;
    totalAge += user.age;
  });
  
  return {
    totalUsers: users.length,
    averageAge: users.length > 0 ? totalAge / users.length : 0,
    roleDistribution: roleCount
  };
}

// Add new user with validation
export function addUser(users, newUser) {
  // Validate required fields
  if (!newUser.name || !newUser.email || !newUser.age || !newUser.role) {
    throw new Error('Missing required fields: name, email, age, role');
  }
  
  // Validate email format
  if (!isValidEmail(newUser.email)) {
    throw new Error('Invalid email format');
  }
  
  // Check for duplicate email
  if (users.some(user => user.email === newUser.email)) {
    throw new Error('User with this email already exists');
  }
  
  // Generate new ID
  const newId = Math.max(...users.map(u => u.id), 0) + 1;
  
  const userWithId = {
    id: newId,
    ...newUser
  };
  
  return [...users, userWithId];
}