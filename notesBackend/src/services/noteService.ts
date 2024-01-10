import db from '../db';
import {note} from '../models/note';

const tableName = 'notes';

export const getAllNotes = async (): Promise<note[]> => {

    return await db(tableName).select('*');
};

export const createNote = async (content:string):Promise<note> =>{
    //Extract the first 10 letters as the title 
    const title = content.substring(0,10);

    const [newTask] = await db(tableName)
        .insert({title, content, folder_id:1})
        .returning('*');

    return newTask as note;
};

export const getNoteByTitle = async (title:string): Promise<note[]> =>{
    return await db(tableName).select('*').where(`title','like','%${title}%`);
};