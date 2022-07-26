import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class extends BaseSchema {
  protected tableName = 'pets';

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.renameColumn('ownerId', 'owner_id');
    });
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.renameColumn('owner_id', 'ownerId');
    });
  }
}
