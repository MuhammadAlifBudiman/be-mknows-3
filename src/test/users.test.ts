// users.test.ts - Test suite for User API endpoints
// This file uses Jest and Supertest to test CRUD operations for the User resource.
// Each test mocks Sequelize model methods and bcrypt hashing for isolation.

import bcrypt from 'bcrypt'; // For password hashing in mocks
import { Sequelize } from 'sequelize'; // Sequelize ORM, mocked for DB connection
import request from 'supertest'; // HTTP assertions for Express apps
import { App } from '@/app'; // Main app class
import { CreateUserDto } from '@dtos/users.dto'; // DTO for user creation
import { UserRoute } from '@routes/users.route'; // User route definition

// Ensure all async operations are completed after tests
afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

/**
 * Test suite for User endpoints
 */
describe('Testing Users', () => {
  /**
   * Test GET /users - should return all users
   */
  describe('[GET] /users', () => {
    it('response findAll users', async () => {
      // Arrange: Mock user data and methods
      const usersRoute = new UserRoute();
      const users = usersRoute.usersController.userService.users;

      // Mock findAll to return a list of users with hashed passwords
      users.findAll = jest.fn().mockReturnValue([
        {
          id: 1,
          email: 'a@email.com',
          password: await bcrypt.hash('q1w2e3r4!', 10),
        },
        {
          id: 2,
          email: 'b@email.com',
          password: await bcrypt.hash('a1s2d3f4!', 10),
        },
        {
          id: 3,
          email: 'c@email.com',
          password: await bcrypt.hash('z1x2c3v4!', 10),
        },
      ]);

      // Mock Sequelize authenticate
      (Sequelize as any).authenticate = jest.fn();
      const app = new App([usersRoute]);
      // Act & Assert: Make GET request and expect 200
      return request(app.getServer()).get(`${usersRoute.path}`).expect(200);
    });
  });

  /**
   * Test GET /users/:id - should return a single user by ID
   */
  describe('[GET] /users/:id', () => {
    it('response findOne user', async () => {
      const userId = 1;

      const usersRoute = new UserRoute();
      const users = usersRoute.usersController.userService.users;

      // Mock findByPk to return a user
      users.findByPk = jest.fn().mockReturnValue({
        id: 1,
        email: 'a@email.com',
        password: await bcrypt.hash('q1w2e3r4!', 10),
      });

      (Sequelize as any).authenticate = jest.fn();
      const app = new App([usersRoute]);
      // Act & Assert: Make GET request and expect 200
      return request(app.getServer()).get(`${usersRoute.path}/${userId}`).expect(200);
    });
  });

  /**
   * Test POST /users - should create a new user
   */
  describe('[POST] /users', () => {
    it('response Create user', async () => {
      const userData: CreateUserDto = {
        email: 'test@email.com',
        password: 'q1w2e3r4!',
      };

      const usersRoute = new UserRoute();
      const users = usersRoute.usersController.userService.users;

      // Mock findOne to return null (user does not exist)
      users.findOne = jest.fn().mockReturnValue(null);
      // Mock create to return the created user
      users.create = jest.fn().mockReturnValue({
        id: 1,
        email: userData.email,
        password: await bcrypt.hash(userData.password, 10),
      });

      (Sequelize as any).authenticate = jest.fn();
      const app = new App([usersRoute]);
      // Act & Assert: Make POST request and expect 201
      return request(app.getServer()).post(`${usersRoute.path}`).send(userData).expect(201);
    });
  });

  /**
   * Test PUT /users/:id - should update an existing user
   */
  describe('[PUT] /users/:id', () => {
    it('response Update user', async () => {
      const userId = 1;
      const userData: CreateUserDto = {
        email: 'test@email.com',
        password: '1q2w3e4r!',
      };

      const usersRoute = new UserRoute();
      const users = usersRoute.usersController.userService.users;

      // Mock findByPk to return the user before update
      users.findByPk = jest.fn().mockReturnValue({
        id: userId,
        email: userData.email,
        password: await bcrypt.hash(userData.password, 10),
      });
      // Mock update to return [1] (number of affected rows)
      users.update = jest.fn().mockReturnValue([1]);
      // Mock findByPk to return the user after update
      users.findByPk = jest.fn().mockReturnValue({
        id: userId,
        email: userData.email,
        password: await bcrypt.hash(userData.password, 10),
      });

      (Sequelize as any).authenticate = jest.fn();
      const app = new App([usersRoute]);
      // Act & Assert: Make PUT request and expect 200
      return request(app.getServer()).put(`${usersRoute.path}/${userId}`).send(userData).expect(200);
    });
  });

  /**
   * Test DELETE /users/:id - should delete a user by ID
   */
  describe('[DELETE] /users/:id', () => {
    it('response Delete user', async () => {
      const userId = 1;

      const usersRoute = new UserRoute();
      const users = usersRoute.usersController.userService.users;

      // Mock findByPk to return the user to be deleted
      users.findByPk = jest.fn().mockReturnValue({
        id: userId,
        email: 'a@email.com',
        password: await bcrypt.hash('q1w2e3r4!', 10),
      });

      (Sequelize as any).authenticate = jest.fn();
      const app = new App([usersRoute]);
      // Act & Assert: Make DELETE request and expect 200
      return request(app.getServer()).delete(`${usersRoute.path}/${userId}`).expect(200);
    });
  });
});
