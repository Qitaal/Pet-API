import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema, rules } from '@ioc:Adonis/Core/Validator';

import User from 'App/Models/User';

export default class AuthController {
  public async register({ request, response, auth }: HttpContextContract) {
    const userSchema = schema.create({
      email: schema.string({ trim: true }, [
        rules.email(),
        rules.unique({ table: 'users', column: 'email', caseInsensitive: true }),
      ]),
      username: schema.string({ trim: true }, [
        rules.unique({ table: 'users', column: 'username', caseInsensitive: true }),
      ]),
      fullname: schema.string({ trim: true }),
      password: schema.string({}, [rules.minLength(8)]),
      phone: schema.string([rules.mobile()]),
    });

    const data = await request.validate({ schema: userSchema });

    const user = await User.create(data);

    await auth.login(user);

    response.status(201);
    response.send({
      success: true,
      message: 'User created successfully',
      data: user,
    });
  }

  public async login({ request, response, auth }: HttpContextContract) {
    const { uid, password } = request.only(['uid', 'password']);

    const user_token = await auth.use('api').attempt(uid, password, { expiresIn: '7days' });

    response.send({
      success: true,
      message: 'Login success',
      data: user_token,
    });
  }

  public async logout({ response, auth }: HttpContextContract) {
    await auth.use('api').revoke();

    response.send({
      success: true,
      message: 'Logout success',
    });
  }
}
