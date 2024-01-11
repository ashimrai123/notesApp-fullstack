import db from "../db";
import { note } from "../models/note";
import { folder } from "../models/folder";

const notesTable = "notes";

const folderTable = "folders";

export const getAllNotes = async (): Promise<note[]> => {
  return await db(notesTable).select("*");
};

export const getAllNotesByFolderId = async (id: number): Promise<note[]> => {
  return await db(notesTable).select("*").where("folder_id", "like", id);
};

export const getAllFolders = async (): Promise<folder[]> => {
  return await db(folderTable).select("*");
};

export const createNote = async (content: string): Promise<note> => {
  //Extract the first 10 letters as the title
  const title = content.substring(0, 4);

  const [newTask] = await db(notesTable)
    .insert({ title, content, folder_id: 1 })
    .returning("*");

  return newTask as note;
};

export const createFolder = async (folder_name: string): Promise<folder> => {
  const [newFolder] = await db(folderTable)
    .insert({ folder_name })
    .returning("*");

  return newFolder as folder;
};

export const getNoteByTitle = async (title: string): Promise<note[]> => {
  return await db(notesTable).select("*").where("title", "like", `%${title}%`);
};
