import { hash } from "bcrypt";
import { Service } from "typedi";
import { DB } from "@database";
import { CreateUserDto } from "@dtos/users.dto";
import { HttpException } from "@/exceptions/HttpException";
import { User, UserParsed, UserQueryParams } from "@interfaces/user.interface";
import { UserModel } from "@/models/users.model";
import { Op } from "sequelize";
import { Pagination } from "@/interfaces/common/pagination.interface";

@Service()
export class UserService {
  private userParsed(user: UserModel): UserParsed {
    return {
      uuid: user.uuid,
      full_name: user.full_name,
      display_picture: user.display_picture,
      email: user.email,
    };
  }

  public async findAllUser(query: UserQueryParams): Promise<{ users: UserParsed[], pagination: Pagination }> {
    const { page = "1", limit = "10", search, order, sort } = query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const where = {};

    if(search) {
      where[Op.or] = [];

      where[Op.or].push({
        [Op.or]: [
          {
            full_name: {
              [Op.iLike]: `%${search}%`,
            },
          },
          {
            email: {
              [Op.iLike]: `%${search}%`,
            },
          }
        ],
      });
    }

    const orderClause = [];
    if (order && sort) {
      if (sort === "asc" || sort === "desc") {
        orderClause.push([order, sort]);
      }
    }

    const { rows: users, count } = await DB.Users.findAndCountAll({ 
      where,
      limit: parseInt(limit),
      offset,
      attributes: { exclude: ["pk"] },
      order: orderClause
    });

    const pagination: Pagination = {
      current_page: parseInt(page),
      size_page: users.length,
      max_page: Math.ceil(count / parseInt(limit)),
      total_data: count,
    };

    const transformedUsers = users.map(user => this.userParsed(user));

    return { users: transformedUsers, pagination };;
  }

  public async findUserById(userId: number): Promise<User> {
    const findUser: User = await DB.Users.findByPk(userId);
    if (!findUser) throw new HttpException(false, 409, "User doesn't exist");

    return findUser;
  }

  public async createUser(userData: CreateUserDto): Promise<User> {
    const findUser: User = await DB.Users.findOne({ where: { email: userData.email } });
    if (findUser) throw new HttpException(false, 409, `This email ${userData.email} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const createUserData: User = await DB.Users.create({ ...userData, password: hashedPassword });
    return createUserData;
  }

  public async updateUser(userId: number, userData: CreateUserDto): Promise<User> {
    const findUser: User = await DB.Users.findByPk(userId);
    if (!findUser) throw new HttpException(false, 409, "User doesn't exist");

    const hashedPassword = await hash(userData.password, 10);
    await DB.Users.update({ ...userData, password: hashedPassword }, { where: { pk: userId } });

    const updateUser: User = await DB.Users.findByPk(userId);
    return updateUser;
  }

  public async deleteUser(userId: number): Promise<User> {
    const findUser: User = await DB.Users.findByPk(userId);
    if (!findUser) throw new HttpException(false, 409, "User doesn't exist");

    await DB.Users.destroy({ where: { pk: userId } });

    return findUser;
  }
}