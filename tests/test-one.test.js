import { test, expect, describe, beforeEach } from 'vitest';
import {
  loadUsers,
  findUserById,
  findUsersByRole,
  getUsersOlderThan,
  isValidEmail,
  calculateAverageAge,
  getUserStatistics,
  addUser
} from '../src/userService.js';

describe('Simple Math Tests', () => {

  test('addition works correctly', () => {
    expect(2 + 2).toBe(4);
  });

  test('subtraction works correctly', () => {
    expect(5 - 3).toBe(2);
  });

  test('simple assertion test', () => {
    expect(true).toBe(true);
  });

  test('multiplication works correctly', () => {
    expect(3 * 3).toBe(9);
  });

  test('division works correctly', () => {
    expect(10 / 2).toBe(5);
  }); 

  test('modulus works correctly', () => {
    expect(10 % 3).toBe(1);
  });

  test('exponentiation works correctly', () => {
    expect(2 ** 3).toBe(8);
  });

});


describe('User Service Tests', () => {
  let mockUsers;
  
  beforeEach(() => {
    // Mock data for testing
    mockUsers = [
      { id: 1, name: "John Doe", email: "john@example.com", age: 30, role: "admin" },
      { id: 2, name: "Jane Smith", email: "jane@example.com", age: 25, role: "user" },
      { id: 3, name: "Bob Johnson", email: "bob@example.com", age: 35, role: "user" },
      { id: 4, name: "Alice Brown", email: "alice@example.com", age: 28, role: "moderator" }
    ];
  });

  describe('findUserById', () => {
    test('should find existing user by id', () => {
      const user = findUserById(mockUsers, 2);
      expect(user.id).toEqual(2);
    });

    test('should return undefined for non-existent id', () => {
      const user = findUserById(mockUsers, 999);
      expect(user).toBeUndefined();
    });
  });

  describe('findUsersByRole', () => {
    test('should find users by role', () => {
      const users = findUsersByRole(mockUsers, 'user');
      expect(users).toHaveLength(2);
      expect(users[0].role).toBe('user');
      expect(users[1].role).toBe('user');
    });

    test('should return empty array for non-existent role', () => {
      const users = findUsersByRole(mockUsers, 'superadmin');
      expect(users).toHaveLength(0);
    });
  });

  describe('getUsersOlderThan', () => {
    test('should find users older than specified age', () => {
      const users = getUsersOlderThan(mockUsers, 27);
      expect(users).toHaveLength(3);
      users.forEach(user => {
        expect(user.age).toBeGreaterThan(27);
      });
    });

    test('should return empty array if no users match', () => {
      const users = getUsersOlderThan(mockUsers, 50);
      expect(users).toHaveLength(0);
    });
  });

  describe('isValidEmail', () => {
    test('should validate correct email formats', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
    });

    test('should reject invalid email formats', () => {
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('@domain.com')).toBe(false);
      expect(isValidEmail('user@')).toBe(false);
      expect(isValidEmail('user@domain')).toBe(false);
    });
  });

  describe('calculateAverageAge', () => {
    test('should calculate correct average age', () => {
      const avgAge = calculateAverageAge(mockUsers);
      expect(avgAge).toBe(29.5); // (30 + 25 + 35 + 28) / 4
    });

    test('should return 0 for empty array', () => {
      const avgAge = calculateAverageAge([]);
      expect(avgAge).toBe(0);
    });
  });

  describe('getUserStatistics', () => {
    test('should return correct statistics', () => {
      const stats = getUserStatistics(mockUsers);
      
      expect(stats.totalUsers).toBe(4);
      expect(stats.averageAge).toBe(29.5);
      expect(stats.roleDistribution).toEqual({
        admin: 1,
        user: 2,
        moderator: 1
      });
    });

    test('should handle empty users array', () => {
      const stats = getUserStatistics([]);
      
      expect(stats.totalUsers).toBe(0);
      expect(stats.averageAge).toBe(0);
      expect(stats.roleDistribution).toEqual({});
    });
  });

  describe('addUser', () => {
    test('should add valid new user', () => {
      const newUser = {
        name: "Charlie Wilson",
        email: "charlie@example.com",
        age: 32,
        role: "user"
      };
      
      const updatedUsers = addUser(mockUsers, newUser);
      
      expect(updatedUsers).toHaveLength(5);
      expect(updatedUsers[4]).toEqual({
        id: 5,
        ...newUser
      });
    });

    test('should throw error for missing required fields', () => {
      const incompleteUser = {
        name: "Incomplete User",
        email: "incomplete@example.com"
        // missing age and role
      };
      
      expect(() => addUser(mockUsers, incompleteUser)).toThrow('Missing required fields');
    });

    test('should throw error for invalid email', () => {
      const userWithInvalidEmail = {
        name: "Invalid Email User",
        email: "invalid-email",
        age: 25,
        role: "user"
      };
      
      expect(() => addUser(mockUsers, userWithInvalidEmail)).toThrow('Invalid email format');
    });

    test('should throw error for duplicate email', () => {
      const duplicateUser = {
        name: "Duplicate User",
        email: "john@example.com", // already exists
        age: 40,
        role: "user"
      };
      
      expect(() => addUser(mockUsers, duplicateUser)).toThrow('User with this email already exists');
    });
  });

  describe('loadUsers (integration test)', () => {
    test('should load users from JSON file', () => {
      const users = loadUsers();
      
      expect(Array.isArray(users)).toBe(true);
      expect(users.length).toBeGreaterThan(0);
      
      // Check structure of first user
      if (users.length > 0) {
        expect(users[0]).toHaveProperty('id');
        expect(users[0]).toHaveProperty('name');
        expect(users[0]).toHaveProperty('email');
        expect(users[0]).toHaveProperty('age');
        expect(users[0]).toHaveProperty('role');
      }
    });
  });
});