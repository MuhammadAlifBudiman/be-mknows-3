import { Router } from "express";

/**
 * Interface for defining Express routes in the application.
 *
 * @property {string} [path] - The base path for the route (optional).
 * @property {Router} router - The Express Router instance handling the route.
 */
export interface Routes {
  /**
   * The base path for the route (optional).
   * Example: '/users'
   */
  path?: string;
  /**
   * The Express Router instance that contains route handlers.
   */
  router: Router;
}