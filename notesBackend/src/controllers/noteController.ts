import { Request, Response } from "express";
import * as services from "../services/noteService";
import { createNoteSchema } from "../validators/noteValidator";

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

export const deleteNote = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    //Call the deleteNote function
    const { id } = req.params;
    const deletedNote = await services.deleteNote(parseInt(id));
    res.status(204).json(deletedNote);
  } catch (error) {
    console.error(error);
  }
};

export const deleteFolder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    //Call the deleteFolder function
    const { id } = req.params;
    const deletedFolder = await services.deleteFolder(parseInt(id));
    console.log("deleted");
    res.status(204).json(deletedFolder);
  } catch (error) {
    console.error(error);
  }
};

export const updateNote = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    if (!id) {
      res.status(400).json({ error: "no id" });
      return;
    }

    //Call the update function from the services
    const updatedNote = await services.updateNote(parseInt(id), content);
    //Send a JSON response containing the note
    res.status(200).json(updatedNote);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getNoteById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { noteId } = req.params;
    if (!noteId) {
      res.status(400).json({ error: "No id " });
      return;
    }
    //Call the getNoteById function from the services
    const getNoteById = await services.getNoteById(parseInt(noteId));

    //Send a JSON response containing the notes to the client
    res.json(getNoteById);
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

    const { title, folderId } = req.body;

    const newNote = await services.createNote(title, folderId);
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
