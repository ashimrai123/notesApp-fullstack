import axios from "axios";
import { initializePage } from "../main";

export async function createNote(folder_id: number) {
  axios
    .post("http://localhost:8000/note", {
      title: "New Note",
      folderId: folder_id,
    })
    .then((response) => {
      console.log("Note created successfully:", response.data);
    })
    .catch((error) => {
      console.error("Error creating note:", error.response.data);
    });
}

export const deleteNoteById = async (noteId: number) => {
  try {
    await axios.delete(`http://localhost:8000/note/${noteId}`);
    console.log("Note deleted successfully");
    //Giving some delay to give little time for database operation
    setTimeout(async () => {
      await initializePage();
    }, 100);
  } catch (error) {
    console.log("Error deleting note: ", error);
  }
};

//Function to update notes
export const updateNotes = async (noteId: number, content: string) => {
  try {
    await axios.put(`http://localhost:8000/updateNote/${noteId}`, { content });
    console.log("Note updated successfully");
  } catch (error) {
    console.log("Error updating notes:", error);
  }
};
