import { DateTime } from 'luxon';
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm';
import Owner from './Owner';

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
  public owner_id: number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @belongsTo(() => Owner, {
    localKey: 'owner_id',
  })
  public owner: BelongsTo<typeof Owner>;
}
