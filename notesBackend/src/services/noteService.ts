import {note} from '../models/note';

let notes : note[] = []; //Simulate a database with a list 


export const getAllNotes = (): note[]=> {
    return notes;
}

export const createNote = (title: string): note => {
    const newTask: note = {id : notes.length + 1, title};
    notes.push(newTask);
    return newTask;
};

export const getNoteByTitle = (title: string): note[] | undefined => {
    return notes.filter(note => note.title.includes(title));
}

