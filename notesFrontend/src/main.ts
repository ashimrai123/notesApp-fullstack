import { handleLogin } from "./user/login";
import { handleSignup } from "./user/signup";
import { createNote } from "./notes/notes";
import { createFolder } from "./notes/folders";
import axios from "axios";

let selectedFolderId: number = 1; //By default first folder would be selected
let selectedNoteId: number = 1;
let debounceTimer: number;

// Entry point
const init = async () => {
  handleLogin();
  handleSignup();
  await initializePage();

  document
    .getElementById("createNoteButton")
    ?.addEventListener("click", async () => {
      await createNote(selectedFolderId);

      //Giving some delay to give little time for database operation
      setTimeout(async () => {
        await initializePage();
      }, 100);
    });

  document
    .getElementById("createFolderButton")
    ?.addEventListener("click", async () => {
      const folderName = (
        document.getElementById("folderNameInput") as HTMLInputElement
      ).value;
      await createFolder(folderName);

      //Giving some delay to give little time for database operation
      setTimeout(async () => {
        await initializePage();
      }, 100);
    });
};

const noteContainer = document.getElementById("noteContainer") as HTMLElement;
const folderContainer = document.getElementById(
  "folderContainer"
) as HTMLElement;

const noteArea = document.getElementById("noteArea") as HTMLElement;

const debounceUpdatedNotes = async (noteId: number, content: string) => {
  clearTimeout(debounceTimer);

  //Set a timeout to call updateNotes
  debounceTimer = setTimeout(async () => {
    try {
      await updateNotes(noteId, content);
      //Giving some delay to give little time for database operation
      setTimeout(async () => {
        await initializePage();
      }, 100);
    } catch (error) {
      console.log("Error updating notes:", error);
    }
  }, 500);
};

const deleteFolderById = async (folderId: number) => {
  try {
    await axios.delete(`http://localhost:8000/folder/${folderId}`);
    console.log("Folder deleted successfully");
    //Giving some delay to give little time for database operation
    setTimeout(async () => {
      await initializePage();
    }, 100);
  } catch (error) {
    console.log("Error deleting folder: ", error);
  }
};

const deleteNoteById = async (noteId: number) => {
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
const updateNotes = async (noteId: number, content: string) => {
  try {
    await axios.put(`http://localhost:8000/updateNote/${noteId}`, { content });
    console.log("Note updated successfully");
  } catch (error) {
    console.log("Error updating notes:", error);
  }
};

//--------------------- RESIZE NOTES AREA WITH WINDOWSIZE ---------------------------------//
window.addEventListener("resize", () => {
  textArea(selectedNoteId);
});

//--------------------- Text Area ---------------------------------//
const textArea = async (noteId: number) => {
  try {
    const response = await axios.get(
      `http://localhost:8000/notearea/${noteId}`
    );

    const noteData = await response.data;
    console.log(noteData.title);
    noteArea.innerHTML = "";

    //Calculate the number of rows and columns based on the dimensions of the page
    const rows = window.innerHeight / 18;
    const columns = window.innerWidth / 18;

    const textarea = document.createElement("textarea");
    textarea.rows = rows;
    textarea.cols = columns;
    textarea.value = noteData.content;

    //--------------------------------Update Notes --------------------------------//
    textarea.addEventListener("input", () => {
      debounceUpdatedNotes(noteId, textarea.value);
    });

    const noteDiv = document.createElement("div");
    noteDiv.appendChild(textarea);
    noteArea.appendChild(noteDiv);
  } catch (error) {
    console.log("Error fetching notes:", error);
  }
};

const fetchNotesByFolderId = async (folderId: number) => {
  try {
    const response = await axios.get(`http://localhost:8000/note/${folderId}`);
    const notes = await response.data;
    console.log(response);

    noteContainer.innerHTML = "";
    //-------Create note list --------------//
    notes.forEach((note: any) => {
      const noteButton = document.createElement("button");
      const deleteNoteButton = document.createElement("button");
      noteButton.innerHTML = note.title;
      deleteNoteButton.innerHTML = "Delete";
      //------Click on the note -----------//
      noteButton.addEventListener("click", () => {
        textArea(note.id);
        selectedNoteId = note.id;
      });
      deleteNoteButton.addEventListener("click", () => {
        deleteNoteById(note.id);
      });
      noteContainer.prepend(deleteNoteButton);
      noteContainer.prepend(noteButton);
    });
  } catch (error) {
    console.log("Error fetching notes:", error);
  }
};

//--------------------Initialize the page contents---------------------------//

const initializePage = async () => {
  try {
    const response = await axios.get("http://localhost:8000/folder");
    const folders = await response.data;

    console.log("Fetched all folders in the database");
    folderContainer.innerHTML = "";
    fetchNotesByFolderId(selectedFolderId);

    folders.forEach((folder: any) => {
      console.log("Displaying folders on the page");
      const folderButton = document.createElement("button");
      const deleteFolderButton = document.createElement("button");
      folderButton.innerHTML = folder.folderName;
      deleteFolderButton.innerHTML = "delete folder";
      folderButton.addEventListener("click", () => {
        //All Notes Of The Folder Fetched
        fetchNotesByFolderId(folder.id);
        selectedFolderId = folder.id;
      });
      deleteFolderButton.addEventListener("click", () => {
        deleteFolderById(folder.id);
      });
      folderContainer?.prepend(deleteFolderButton);
      folderContainer?.prepend(folderButton);
    });
  } catch (error) {
    console.log("Error fetching folders:", error);
  }
};

init();
