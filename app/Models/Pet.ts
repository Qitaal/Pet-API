import { DateTime } from 'luxon';
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm';
import User from './User';

export default class Pet extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public name: string;

  @column()
  public age: number;

  @column.date()
  public dob: DateTime;

  @column()
  public note: string;

  @column()
  public user_id: number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @belongsTo(() => User, {
    localKey: 'user_id',
  })
  public user: BelongsTo<typeof User>;

  @column()
  public is_deleted: boolean;

  @column()
  public gender: string;
}
