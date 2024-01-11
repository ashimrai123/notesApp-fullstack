import { Knex } from "knex";

const USER_TABLE_NAME = "users";
const FOLDER_TABLE_NAME = "folders";
const NOTES_TABLE_NAME = "notes";

/**
 * Create table USER_TABLE_NAME.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function up(knex: Knex): Promise<void> {
  //User table
  await knex.schema.createTable(USER_TABLE_NAME, (table) => {
    table.bigIncrements();

    table.string("username").notNullable();
    table.string("email");
    table.string("password");
  });

  //Folders table
  await knex.schema.createTable(FOLDER_TABLE_NAME, (table) => {
    table.bigIncrements();
    table.string("folder_name").notNullable();
    table.bigInteger("user_id").unsigned().notNullable();
    table.foreign("user_id").references(`${USER_TABLE_NAME}.id`);
  });

  //Notes Table
  await knex.schema.createTable(NOTES_TABLE_NAME, (table) => {
    table.bigIncrements();
    table.string("title");
    table.text("content");
    table.bigInteger("folder_id").unsigned().notNullable();
    table.foreign("folder_id").references(`${FOLDER_TABLE_NAME}.id`);
    table.timestamps(true, true); // created_at and updated_at column
  });
}

/**
 * Drop table USER_TABLE_NAME.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(NOTES_TABLE_NAME);
  await knex.schema.dropTable(FOLDER_TABLE_NAME);
  await knex.schema.dropTable(USER_TABLE_NAME);
}
