// auth.test.ts - Unit tests for authentication routes using Jest, Supertest, and Sequelize
// Import required modules and dependencies
import bcrypt from 'bcrypt'; // For password hashing
import { Sequelize } from 'sequelize'; // ORM for database mocking
import request from 'supertest'; // For HTTP assertions
import { App } from '@/app'; // Main App class
import { CreateUserDto } from '@dtos/users.dto'; // DTO for user creation
import { AuthRoute } from '@routes/auth.route'; // Auth route definition

// Ensure all async operations are completed after tests
afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

/**
 * Test suite for authentication endpoints
 */
describe('Testing Auth', () => {
  /**
   * Test the signup endpoint
   * Should create a new user and return user data
   */
  describe('[POST] /signup', () => {
    it('response should have the Create userData', async () => {
      // Mock user data for signup
      const userData: CreateUserDto = {
        email: 'test@email.com',
        password: 'q1w2e3r4!',
      };

      // Initialize AuthRoute and mock user model methods
      const authRoute = new AuthRoute();
      const users = authRoute.authController.authService.users;

      // Mock findOne to simulate user not found
      users.findOne = jest.fn().mockReturnValue(null);
      // Mock create to simulate user creation and password hashing
      users.create = jest.fn().mockReturnValue({
        id: 1,
        email: userData.email,
        password: await bcrypt.hash(userData.password, 10),
      });

      // Mock Sequelize authenticate
      (Sequelize as any).authenticate = jest.fn();
      // Initialize app with auth route
      const app = new App([authRoute]);
      // Send signup request and expect 201 Created
      return request(app.getServer()).post(`${authRoute.path}signup`).send(userData).expect(201);
    });
  });

  /**
   * Test the login endpoint
   * Should return Set-Cookie header with Authorization token
   */
  describe('[POST] /login', () => {
    it('response should have the Set-Cookie header with the Authorization token', async () => {
      // Mock user data for login
      const userData: CreateUserDto = {
        email: 'test@email.com',
        password: 'q1w2e3r4!',
      };

      // Initialize AuthRoute and mock user model methods
      const authRoute = new AuthRoute();
      const users = authRoute.authController.authService.users;

      // Mock findOne to simulate user found with hashed password
      users.findOne = jest.fn().mockReturnValue({
        id: 1,
        email: userData.email,
        password: await bcrypt.hash(userData.password, 10),
      });

      // Mock Sequelize authenticate
      (Sequelize as any).authenticate = jest.fn();
      // Initialize app with auth route
      const app = new App([authRoute]);
      // Send login request and expect Set-Cookie header with Authorization
      return request(app.getServer())
        .post(`${authRoute.path}login`)
        .send(userData)
        .expect('Set-Cookie', /^Authorization=.+/);
    });
  });

  /**
   * Test the logout endpoint (commented out)
   * Should clear the Authorization cookie
   */
  // describe('[POST] /logout', () => {
  //   it('logout Set-Cookie Authorization=; Max-age=0', async () => {
  //     const authRoute = new AuthRoute();

  //     const app = new App([authRoute]);
  //     return request(app.getServer())
  //       .post(`${authRoute.path}logout`)
  //       .expect('Set-Cookie', /^Authorization=\;/);
  //   });
  // });
});
