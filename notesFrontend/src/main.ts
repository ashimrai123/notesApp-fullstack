import { handleLogin } from "./user/login";
import { handleSignup } from "./user/signup";
import { createNote } from "./notes/notes";

handleLogin();
handleSignup();

document
  .getElementById("createNoteButton")
  ?.addEventListener("click", createNote);

document.addEventListener("DOMContentLoaded", async () => {
  const noteContainer = document.getElementById("noteContainer") as HTMLElement;

  // try {
  //   //Make GET Request to the backend to fetch all notes
  //   const response = await fetch("http://localhost:8000/note");
  //   const notes = await response.json();

  //   notes.forEach((note: any) => {
  //     const noteDiv = document.createElement("div");
  //     noteDiv.innerHTML = `<button>${note.title}</button>`;
  //     noteContainer?.appendChild(noteDiv);
  //   });
  // } catch (error) {
  //   console.log("Error fetching notes:", error);
  // }

  //Function to fetch notes by folder Id
  const fetchNotesByFolderId = async (folderId: number) => {
    try {
      const response = await fetch(`http://localhost:8000/note/${folderId}`);
      const notes = await response.json();

      //clear existing notes in the container
      noteContainer.innerHTML = "";
      notes.forEach((note: any) => {
        const noteDiv = document.createElement("div");
        noteDiv.innerHTML = `<button>${note.title}</button>`;
        noteContainer.appendChild(noteDiv);
      });
    } catch (error) {
      console.log("Error fetching notes:", error);
    }
  };

  const folderContainer = document.getElementById("folderContainer");

  try {
    //Make GET Request to the backend to fetch all folders
    const response = await fetch("http://localhost:8000/folder");
    const folders = await response.json();
    console.log(folders);
    folders.forEach((folder: any) => {
      const folderButton = document.createElement("button");
      folderButton.innerHTML = folder.folderName;
      folderButton.addEventListener("click", () => {
        console.log(`Button clicked for folder: ${folder.folderName} `);

        //Fetch notes when a folder button is clicked
        fetchNotesByFolderId(folder.id);
      });
      folderContainer?.appendChild(folderButton);
    });
  } catch (error) {
    console.log("Error fetching folders:", error);
  }
});
