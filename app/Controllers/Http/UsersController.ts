import { AuthenticationException } from '@adonisjs/auth/build/standalone';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import User from 'App/Models/User';

export default class UsersController {
  public async index({ auth, response }: HttpContextContract) {
    if (!auth.user?.is_admin) {
      throw new AuthenticationException('Unauthorized access', 'E_UNAUTHORIZED_ACCESS', 'api');
    }

    const users = await User.query().where({ is_deleted: false }).preload('pets');

    response.send({
      success: true,
      message: 'Data found',
      data: users,
    });
  }

  public async store({ auth, request, response }: HttpContextContract) {
    if (!auth.user?.is_admin) {
      throw new AuthenticationException('Unauthorized access', 'E_UNAUTHORIZED_ACCESS', 'api');
    }

    const userSchema = schema.create({
      email: schema.string({ trim: true }, [
        rules.email(),
        rules.unique({ table: 'users', column: 'email', caseInsensitive: true }),
      ]),
      fullname: schema.string({ trim: true }),
      is_admin: schema.boolean(),
      note: schema.string.optional({ trim: true }),
      username: schema.string({ trim: true }, [
        rules.unique({ table: 'users', column: 'username', caseInsensitive: true }),
      ]),
      password: schema.string({}, [rules.minLength(8)]),
      phone: schema.string([rules.mobile()]),
    });

    const payload = await request.validate({ schema: userSchema });

    const user = await User.create(payload);

    response.status(201).send({
      success: true,
      message: 'User created successfully',
      data: user,
    });
  }

  public async show({ auth, params, response }: HttpContextContract) {
    if (!auth.user?.is_admin && auth.user?.id != params.id) {
      throw new AuthenticationException('Unauthorized access', 'E_UNAUTHORIZED_ACCESS', 'api');
    }

    let user: User;

    try {
      user = await User.query()
        .where({ id: params.id, is_deleted: false })
        .preload('pets')
        .firstOrFail();

      response.send({
        success: true,
        message: 'Data found',
        data: user,
      });
    } catch (error) {
      response.send({
        success: true,
        message: 'Data not found',
      });
    }
  }

  public async update({ auth, params, request, response }: HttpContextContract) {
    if (!auth.user?.is_admin) {
      if (auth.user?.id != params.id) {
        throw new AuthenticationException('Unauthorized access', 'E_UNAUTHORIZED_ACCESS', 'api');
      }
    }

    let user: User;

    try {
      user = await User.query().where({ id: params.id, is_deleted: false }).firstOrFail();
    } catch (error) {
      return response.send({
        success: true,
        message: 'Data not found',
      });
    }

    const userSchema = schema.create({
      fullname: schema.string({ trim: true }),
      is_admin: schema.boolean(),
      note: schema.string.optional({ trim: true }),
      phone: schema.string([rules.mobile()]),
    });

    const payload = await request.validate({ schema: userSchema });

    user.fullname = payload.fullname;
    user.is_admin = payload.is_admin;
    user.note = payload.note ? payload.note : '';
    user.phone = payload.phone;

    const updatedUser = await user.save();

    response.send({
      success: true,
      message: 'User updated successfully',
      data: updatedUser,
    });
  }

  public async destroy({ auth, params, response }: HttpContextContract) {
    if (!auth.user?.is_admin) {
      throw new AuthenticationException('Unauthorized access', 'E_UNAUTHORIZED_ACCESS', 'api');
    }

    const user = await User.query().where({ id: params.id, is_deleted: false }).firstOrFail();

    user.is_deleted = true;

    const deletedUser = await user.save();

    return response.send({
      success: true,
      message: 'User deleted successfully',
      data: deletedUser,
    });
  }
}
