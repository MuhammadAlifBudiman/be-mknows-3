// UserService handles all user-related business logic, including CRUD operations and user queries.
// Imports
import { hash } from "bcrypt"; // For password hashing
import { Service } from "typedi"; // Dependency injection
import { DB } from "@database"; // Database instance
import { CreateUserDto } from "@dtos/users.dto"; // DTO for user creation
import { HttpException } from "@/exceptions/HttpException"; // Custom HTTP exception
import { User, UserParsed, UserQueryParams } from "@interfaces/user.interface"; // User interfaces
import { UserModel } from "@/models/users.model"; // User model
import { Op } from "sequelize"; // Sequelize operators
import { Pagination } from "@/interfaces/common/pagination.interface"; // Pagination interface

@Service() // Marks the class as injectable by typedi
export class UserService {
  /**
   * Parses a UserModel instance to a UserParsed object (for API responses).
   * @param user - The user model instance
   * @returns UserParsed object
   */
  private userParsed(user: UserModel): UserParsed {
    return {
      uuid: user.uuid, // User UUID
      full_name: user.full_name, // User's full name
      display_picture: user.display_picture, // User's display picture URL
      email: user.email, // User's email
    };
  }

  /**
   * Finds all users with optional pagination, search, and sorting.
   * @param query - Query parameters for pagination, search, and sorting
   * @returns List of users and pagination info
   */
  public async findAllUser(query: UserQueryParams): Promise<{ users: UserParsed[], pagination: Pagination }> {
    const { page = "1", limit = "10", search, order, sort } = query; // Destructure query params
    const offset = (parseInt(page) - 1) * parseInt(limit); // Calculate offset for pagination

    const where = {}; // Sequelize where clause

    // If search is provided, add search conditions for full_name and email
    if(search) {
      where[Op.or] = [];
      where[Op.or].push({
        [Op.or]: [
          {
            full_name: {
              [Op.iLike]: `%${search}%`, // Case-insensitive search for full_name
            },
          },
          {
            email: {
              [Op.iLike]: `%${search}%`, // Case-insensitive search for email
            },
          }
        ],
      });
    }

    const orderClause = []; // Sequelize order clause
    // If order and sort are provided, add to order clause
    if (order && sort) {
      if (sort === "asc" || sort === "desc") {
        orderClause.push([order, sort]);
      }
    }

    // Query users with pagination, search, and sorting
    const { rows: users, count } = await DB.Users.findAndCountAll({ 
      where,
      limit: parseInt(limit),
      offset,
      attributes: { exclude: ["pk"] }, // Exclude primary key from result
      order: orderClause
    });

    // Build pagination info
    const pagination: Pagination = {
      current_page: parseInt(page), // Current page number
      size_page: users.length, // Number of users in current page
      max_page: Math.ceil(count / parseInt(limit)), // Total number of pages
      total_data: count, // Total number of users
    };

    // Transform users to UserParsed format
    const transformedUsers = users.map(user => this.userParsed(user));

    return { users: transformedUsers, pagination }; // Return users and pagination
  }

  /**
   * Finds a user by their primary key (ID).
   * @param userId - User's primary key
   * @returns User object
   * @throws HttpException if user does not exist
   */
  public async findUserById(userId: number): Promise<User> {
    const findUser: User = await DB.Users.findByPk(userId);
    if (!findUser) throw new HttpException(false, 409, "User doesn't exist");
    return findUser;
  }

  /**
   * Creates a new user with hashed password.
   * @param userData - Data for creating user
   * @returns Created user object
   * @throws HttpException if email already exists
   */
  public async createUser(userData: CreateUserDto): Promise<User> {
    const findUser: User = await DB.Users.findOne({ where: { email: userData.email } });
    if (findUser) throw new HttpException(false, 409, `This email ${userData.email} already exists`);

    const hashedPassword = await hash(userData.password, 10); // Hash password
    const createUserData: User = await DB.Users.create({ ...userData, password: hashedPassword });
    return createUserData;
  }

  /**
   * Updates an existing user by ID, including password hashing.
   * @param userId - User's primary key
   * @param userData - Data to update
   * @returns Updated user object
   * @throws HttpException if user does not exist
   */
  public async updateUser(userId: number, userData: CreateUserDto): Promise<User> {
    const findUser: User = await DB.Users.findByPk(userId);
    if (!findUser) throw new HttpException(false, 409, "User doesn't exist");

    const hashedPassword = await hash(userData.password, 10); // Hash new password
    await DB.Users.update({ ...userData, password: hashedPassword }, { where: { pk: userId } });

    const updateUser: User = await DB.Users.findByPk(userId);
    return updateUser;
  }

  /**
   * Deletes a user by their primary key (ID).
   * @param userId - User's primary key
   * @returns Deleted user object
   * @throws HttpException if user does not exist
   */
  public async deleteUser(userId: number): Promise<User> {
    const findUser: User = await DB.Users.findByPk(userId);
    if (!findUser) throw new HttpException(false, 409, "User doesn't exist");

    await DB.Users.destroy({ where: { pk: userId } });

    return findUser;
  }
}