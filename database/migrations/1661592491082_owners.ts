import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class extends BaseSchema {
  protected tableName = 'owners';

  public async up() {
    this.schema.dropTable(this.tableName);
  }

  public async down() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('email');
      table.string('phone');
      table.timestamp('created_at', { useTz: true });
      table.timestamp('updated_at', { useTz: true });
    });
  }
}
