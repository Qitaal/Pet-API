import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import User from 'App/Models/User';

export default class AuthController {
  public async register({ request, response, auth }: HttpContextContract) {
    const userSchema = schema.create({
      username: schema.string({ trim: true }, [
        rules.unique({ table: 'users', column: 'username', caseInsensitive: true }),
      ]),
      email: schema.string({ trim: true }, [
        rules.email(),
        rules.unique({ table: 'users', column: 'username', caseInsensitive: true }),
      ]),
      password: schema.string({}, [rules.minLength(8)]),
    });

    const data = await request.validate({ schema: userSchema });

    const user = await User.create(data);

    await auth.login(user);

    response.status(201);

    return user;
  }

  public async login({ request, response, auth, session }: HttpContextContract) {
    const { uid, password } = request.only(['uid', 'password']);

    try {
      return await auth.use('api').attempt(uid, password, { expiresIn: '7days' });
    } catch {
      return response.unauthorized('Invalid credentials');
    }
  }

  public async logout({ request, auth }: HttpContextContract) {
    await auth.use('api').revoke();
    return { message: 'Logout success' };
  }
}
