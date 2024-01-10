import Joi from 'joi';

export const getAllNotesSchema = Joi.object({
});

export const createNoteSchema = Joi.object({
    title: Joi.string().min(3).max(50).trim(),
    content: Joi.string()
});
