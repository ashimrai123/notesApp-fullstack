import { Request, Response } from "express";
import * as services from "../services/noteService";
import {
  createNoteSchema,
  createFolderSchema,
} from "../validators/noteValidator";

export const getAllNotes = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Call the getAllNotes function from the services
    const notes = await services.getAllNotes();

    // Send a JSON response containing the notes array to the client
    res.json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllNotesByFolderId = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: "No Id" });
      return;
    }
    //Call the getAllNotesById function from the services
    const notesByFolderId = await services.getAllNotesByFolderId(parseInt(id));

    // Send a JSON response containing the notes array to the client
    res.json(notesByFolderId);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllFolders = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Call the getAllFolders function from the services
    const folders = await services.getAllFolders();

    //Send a JSON response containing the folders array to the client
    res.json(folders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createNote = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Validate request body
    const { error } = createNoteSchema.validate(req.body);
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    const { content } = req.body;

    const newNote = await services.createNote(content);
    res.status(201).json(newNote);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createFolder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    //Validate request body
    const { error } = createFolderSchema.validate(req.body);
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    const { folder_name } = req.body;
    const newFolder = await services.createFolder(folder_name);
    res.status(201).json(newFolder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getNoteByTitle = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { title } = req.body;
    if (!title) {
      res.status(400).json({ error: "No title" });
      return;
    }

    const result = await services.getNoteByTitle(title);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
