import Joi from "joi";

export const getAllNotesSchema = Joi.object({});

export const createNoteSchema = Joi.object({
  title: Joi.string().min(3).max(50).trim(),
  content: Joi.string(),
  folderId: Joi.number(),
});

export const createFolderSchema = Joi.object({
  folder_name: Joi.string().min(1),
  id: Joi.number(),
  userId: Joi.number(),
});
