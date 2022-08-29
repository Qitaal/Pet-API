import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class extends BaseSchema {
  protected tableName = 'users';

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('fullname');
      table.boolean('is_admin').defaultTo(false);
      table.boolean('is_deleted').defaultTo(false);
      table.string('phone');
      table.string('note');
    });
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('fullname');
      table.dropColumn('is_admin');
      table.dropColumn('is_deleted');
      table.dropColumn('phone');
      table.dropColumn('note');
    });
  }
}
