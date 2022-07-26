import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import Pet from 'App/Models/Pet';

export default class PetsController {
  public async index() {
    return Pet.all();
  }

  public async store({ request, response }: HttpContextContract) {
    const petSchema = schema.create({
      name: schema.string({ trim: true }),
      age: schema.number(),
      dob: schema.date({ format: 'yyyy-MM-dd' }),
      note: schema.string.optional({ trim: true }),
      owner_id: schema.number([rules.exists({ table: 'owners', column: 'id' })]),
    });

    const payload = await request.validate({ schema: petSchema });

    const pet = await Pet.create(payload);

    response.status(201);

    return pet;
  }

  public async show({ params }: HttpContextContract) {
    return Pet.findOrFail(params.id);
  }

  public async update({ params, request }: HttpContextContract) {
    const pet = await Pet.findOrFail(params.id);

    const petSchema = schema.create({
      name: schema.string({ trim: true }),
      age: schema.number(),
      dob: schema.date({ format: 'yyyy-MM-dd' }),
      note: schema.string.optional({ trim: true }),
    });

    const payload = await request.validate({ schema: petSchema });

    pet.name = payload.name;
    pet.age = payload.age;
    pet.dob = payload.dob;
    if (payload.note) {
      pet.note = payload.note;
    }

    return pet.save();
  }

  public async destroy({ params }: HttpContextContract) {
    const pet = await Pet.findOrFail(params.id);

    await pet.delete();

    return pet;
  }
}
