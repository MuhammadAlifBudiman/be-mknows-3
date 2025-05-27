/**
 * Interface representing a Category entity.
 *
 * @property {number} pk - Primary key of the category (usually auto-incremented).
 * @property {string} uuid - Universally unique identifier for the category.
 * @property {string} name - Name of the category.
 * @property {string} description - Description of the category.
 */
export interface Category {
  /** Primary key of the category (auto-incremented integer) */
  pk: number;
  /** Universally unique identifier for the category */
  uuid: string;

  /** Name of the category */
  name: string;
  /** Description of the category */
  description: string;
}