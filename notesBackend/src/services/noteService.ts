import db from "../db";
import { note } from "../models/note";
import { folder } from "../models/folder";

const notesTable = "notes";

const folderTable = "folders";

export const getAllNotes = async (): Promise<note[]> => {
  return await db(notesTable).select("*");
};

export const getNoteById = async (noteId: number): Promise<note | null> => {
  const [noteRecord] = await db(notesTable)
    .select("*")
    .where("id", "=", noteId);

  return noteRecord ? (noteRecord as note) : null;
};

export const deleteNote = async (id: number): Promise<boolean> => {
  try {
    const deleteCount = await db(notesTable).where("id", "=", id).del();
    return deleteCount > 0;
  } catch (error) {
    console.error("Error deleting note:", error);
    return false;
  }
};

export const deleteFolder = async (id: number): Promise<boolean> => {
  try {
    await db(notesTable).where("folderId", "=", id).del();
    const deleteCount = await db(folderTable).where("id", "=", id).del();
    console.log("delete Executed");
    return deleteCount > 0;
  } catch (error) {
    console.error("Error deleting folder:", error);
    return false;
  }
};

export const updateNote = async (
  id: number,
  content: string
): Promise<note | null> => {
  try {
    //Extract the first 10 letters of the content for the tile from the first line
    const lines = content.split("\n");
    const title = lines[0].substring(0, 20);

    const [updateNote] = await db(notesTable)
      .where("id", "=", id)
      .update({ content, title })
      .returning("*");

    return updateNote ? (updateNote as note) : null;
  } catch (error) {
    console.error("Error updating notes:", error);
    return null;
  }
};

export const getAllNotesByFolderId = async (id: number): Promise<note[]> => {
  return await db(notesTable).select("*").where("folder_id", "=", id);
};

export const getAllFolders = async (userId: any): Promise<folder[]> => {
  return await db(folderTable)
    .select("*")
    .where("user_id", "=", db.raw("?", [BigInt(parseInt(userId))]));
};

export const createNote = async (
  title: string,
  folderId: number
): Promise<note> => {
  //Extract the first 10 letters as the title

  const [newTask] = await db(notesTable)
    .insert({ title, folder_id: folderId, content: "" })
    .returning("*");

  return newTask as note;
};

export const createFolder = async (
  folder_name: string,
  user_id: any
): Promise<folder> => {
  const [newFolder] = await db(folderTable)
    .insert({ folder_name, user_id })
    .returning("*");

  return newFolder as folder;
};

export const getNoteByTitle = async (title: string): Promise<note[]> => {
  return await db(notesTable).select("*").where("title", "like", `%${title}%`);
};
