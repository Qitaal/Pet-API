import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class extends BaseSchema {
  protected tableName = 'pets';

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign('owner_id', 'pets_ownerid_foreign');
      table.dropColumn('owner_id');
      table.integer('user_id').unsigned().notNullable().references('id').inTable('users');
      table.boolean('is_deleted').defaultTo(false);
      table.string('gender');
    });
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('owner_id').unsigned().notNullable().references('id').inTable('owners');
      table.dropForeign('user_id', 'pets_user_id_foreign');
      table.dropColumn('user_id');
      table.dropColumn('is_deleted');
      table.dropColumn('gender');
    });
  }
}
