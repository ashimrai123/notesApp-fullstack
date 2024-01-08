import { Request, Response } from "express";
import * as noteService from "../services/noteService";
import { getAllNotesSchema, createNoteSchema } from "../validators/noteValidator";

export const getAllNotes = (req: Request, res: Response): void => {
  // Validate query parameters
  const { error } = getAllNotesSchema.validate(req.query);
  if (error) {
    res.status(400).json({ error: error.message });
    return;
  }

  // Call the getAllTasks function from the noteService
  const notes = noteService.getAllNotes();

  // Send a JSON response containing the tasks array to the client
  res.json(notes);
};

export const createNote = (req: Request, res: Response): void => {
  // Validate request body
  const { error } = createNoteSchema.validate(req.body);
  if (error) {
    res.status(400).json({ error: error.message });
    return;
  }

  const { title } = req.body;

  if (!title) {
    res.status(400).json({ error: `No title` });
    return;
  }

  const newNote = noteService.createNote(title);
  res.status(201).json(newNote);
};



export const getNoteByTitle = (req: Request, res: Response): void => {
  const { title } = req.body;
  if (!title) {
    res.status(400).json({ erro: `No title` });
    return;
  }

  const result = noteService.getNoteByTitle(title);
  res.json(result);
};
