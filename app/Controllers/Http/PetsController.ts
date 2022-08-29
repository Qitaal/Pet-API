import { AuthenticationException } from '@adonisjs/auth/build/standalone';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import Pet from 'App/Models/Pet';

export default class PetsController {
  public async index({ auth, request, response }: HttpContextContract) {
    const { user_id } = request.qs();
    let pets: Pet[];

    if (!auth.user?.is_admin) {
      if (user_id && user_id != auth.user?.id) {
        throw new AuthenticationException('Unauthorized access', 'E_UNAUTHORIZED_ACCESS', 'api');
      }
      pets = await Pet.query().where({ is_deleted: false, user_id: auth.user?.id });
    } else {
      if (user_id) {
        pets = await Pet.query().where({ is_deleted: false, user_id: user_id });
      } else {
        pets = await Pet.query().where({ is_deleted: false });
      }
    }

    response.send({
      success: true,
      message: pets.length ? 'Data found' : 'Data not found',
      data: pets,
    });
  }

  public async store({ auth, request, response }: HttpContextContract) {
    const petSchema = schema.create({
      name: schema.string({ trim: true }),
      age: schema.number(),
      dob: schema.date({ format: 'yyyy-MM-dd' }),
      note: schema.string.optional({ trim: true }),
      user_id: schema.number([rules.exists({ table: 'users', column: 'id' })]),
      gender: schema.string(),
    });

    if (!auth.user?.is_admin) {
      throw new AuthenticationException('Unauthorized access', 'E_UNAUTHORIZED_ACCESS', 'api');
    }

    const payload = await request.validate({ schema: petSchema });

    const pet = await Pet.create(payload);

    response.status(201).send({
      success: true,
      message: 'Pet created successfully',
      data: pet,
    });
  }

  public async show({ auth, params, response }: HttpContextContract) {
    let pet: Pet;
    if (!auth.user?.is_admin && auth.user?.id != params.id) {
      throw new AuthenticationException('Unauthorized access', 'E_UNAUTHORIZED_ACCESS', 'api');
    }

    try {
      pet = await Pet.query().where({ id: params.id, is_deleted: false }).firstOrFail();
      response.send({
        success: true,
        message: 'Data found',
        data: pet,
      });
    } catch (error) {
      response.send({
        success: true,
        message: 'Data not found',
      });
    }
  }

  public async update({ auth, params, request, response }: HttpContextContract) {
    let pet: Pet;

    if (!auth.user?.is_admin) {
      throw new AuthenticationException('Unauthorized access', 'E_UNAUTHORIZED_ACCESS', 'api');
    }
    try {
      pet = await Pet.query().where({ id: params.id, is_deleted: false }).firstOrFail();
    } catch (e) {
      return response.send({
        success: true,
        message: 'Data not found',
      });
    }

    const petSchema = schema.create({
      name: schema.string({ trim: true }),
      age: schema.number(),
      dob: schema.date({ format: 'yyyy-MM-dd' }),
      note: schema.string.optional({ trim: true }),
      user_id: schema.number([rules.exists({ table: 'users', column: 'id' })]),
      gender: schema.string(),
    });

    const payload = await request.validate({ schema: petSchema });

    pet.name = payload.name;
    pet.age = payload.age;
    pet.dob = payload.dob;
    pet.user_id = payload.user_id;
    pet.note = payload.note ? payload.note : '';
    pet.gender = payload.gender;

    const updatedPet = await pet.save();

    response.send({
      success: true,
      message: 'Pet updated successfully',
      data: updatedPet,
    });
  }

  public async destroy({ auth, params, response }: HttpContextContract) {
    if (!auth.user?.is_admin) {
      throw new AuthenticationException('Unauthorized access', 'E_UNAUTHORIZED_ACCESS', 'api');
    }

    let pet: Pet;
    try {
      pet = await Pet.query().where({ id: params.id, is_deleted: false }).firstOrFail();
      pet.is_deleted = true;

      const deletedPet = await pet.save();
      return response.send({
        success: true,
        message: 'Pet deleted successfully',
        data: deletedPet,
      });
    } catch (error) {
      return response.send({
        success: true,
        message: 'Data not found',
      });
    }
  }
}
