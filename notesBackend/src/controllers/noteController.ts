import { Request, Response } from 'express';
import * as taskService from '../services/noteService';
import { createNoteSchema } from '../validators/noteValidator';

export const getAllNotes = async (req: Request, res: Response): Promise<void> => {
  try {

    // Call the getAllTasks function from the taskService
    const tasks = await taskService.getAllNotes();

    // Send a JSON response containing the tasks array to the client
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const createNote = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate request body
    const { error } = createNoteSchema.validate(req.body);
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    const { content } = req.body;

    // // if (!title) {
    // //   res.status(400).json({ error: 'No title' });
    // //   return;
    // // }

    const newTask = await taskService.createNote(content);
    res.status(201).json(newTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getNoteByTitle = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title } = req.body;
    if (!title) {
      res.status(400).json({ error: 'No title' });
      return;
    }

    const result = await taskService.getNoteByTitle(title);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
