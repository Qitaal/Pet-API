import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import Owner from 'App/Models/Owner';

export default class OwnersController {
  public async index() {
    return Owner.query().preload('pets');
  }

  public async store({ request, response }: HttpContextContract) {
    const ownerSchema = schema.create({
      name: schema.string({ trim: true }),
      email: schema.string([rules.email()]),
      phone: schema.string([rules.mobile()]),
    });

    const payload = await request.validate({ schema: ownerSchema });

    const owner = await Owner.create(payload);

    response.status(201);

    return owner;
  }

  public async show({ params }: HttpContextContract) {
    return Owner.query().where('id', params.id).preload('pets').firstOrFail();
  }

  public async update({ params, request }: HttpContextContract) {
    const owner = await Owner.findOrFail(params.id);

    const ownerSchema = schema.create({
      name: schema.string({ trim: true }),
      email: schema.string([rules.email()]),
      phone: schema.string([rules.mobile()]),
    });

    const payload = await request.validate({ schema: ownerSchema });

    owner.name = payload.name;
    owner.email = payload.email;
    owner.phone = payload.phone;

    return owner.save();
  }

  public async destroy({ params }: HttpContextContract) {
    const owner = await Owner.findOrFail(params.id);

    await owner.delete();

    return owner;
  }
}
