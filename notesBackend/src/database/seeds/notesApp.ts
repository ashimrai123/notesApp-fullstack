import { Knex } from 'knex';

const USER_TABLE_NAME = 'users';
const FOLDER_TABLE_NAME = 'folders';
const NOTES_TABLE_NAME = 'notes';

/**
 * Delete existing entries and seed values for tables USER_TABLE_NAME, FOLDER_TABLE_NAME, and NOTES_TABLE_NAME.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function seed(knex: Knex): Promise<void> {
  // Delete existing entries
  await knex(USER_TABLE_NAME).del();
  await knex(FOLDER_TABLE_NAME).del();
  await knex(NOTES_TABLE_NAME).del();

  // Seed values for the users table
  await knex(USER_TABLE_NAME).insert([
    {
      username: 'user1',
      email: 'user1@gmail.com',
      password: 'password1',
    },
    {
      username: 'user2',
      email: 'user2@gmail.com',
      password: 'password2',
    },
  ]);

  // Seed values for the folders table
  await knex(FOLDER_TABLE_NAME).insert([
    {
      folder_name: 'Personal',
      user_id: 1,
    },
    {
      folder_name: 'Work',
      user_id: 1,
    },
    {
      folder_name: 'General',
      user_id: 2,
    },
  ]);

  // Seed values for the notes table
  await knex(NOTES_TABLE_NAME).insert([
    {
      title: 'Meeting Notes',
      content: 'Discuss project updates...',
      folder_id: 2,
    },
    {
      title: 'Grocery List',
      content: 'Milk, eggs, bread...',
      folder_id: 1,
    },
    {
      title: 'Ideas',
      content: 'Brainstorming session...',
      folder_id: 3,
    },
  ]);
}
