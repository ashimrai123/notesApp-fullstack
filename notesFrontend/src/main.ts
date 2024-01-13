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

  const userNameContainer = document.getElementById("userNameContainer");
  const userName = document.createElement("div");
  userName.classList.add("userName");
  userName.innerHTML = "dog";
  userNameContainer?.append(userName); //RETRIEVE USERNAME FROM USER

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
      const folderNameInput = document.getElementById(
        "folderNameInput"
      ) as HTMLInputElement;
      const folderName = (
        document.getElementById("folderNameInput") as HTMLInputElement
      ).value;
      if (folderName !== "") {
        await createFolder(folderName);
        folderNameInput.value = ""; //Clear the input field after successful folder creation
      } else {
        console.log("input field is empty");
      }

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
      const noteButtonsContainer = document.createElement("div");
      // Add class to the noteButtonsContainer
      noteButtonsContainer.classList.add("noteButtonsContainer");

      const noteButton = document.createElement("button");
      // Add class to the noteButton
      noteButton.classList.add("noteButton");

      const noteOptionButton = document.createElement("button");
      // Add class to the noteOptionButton
      noteOptionButton.classList.add("noteOptionButton");

      const deleteNoteButton = document.createElement("button");
      // Add class to the noteButton
      deleteNoteButton.classList.add("deleteNoteButton");

      noteButton.innerHTML = note.title;
      deleteNoteButton.innerHTML = `<svg class = "deleteNoteImage" viewBox="0 0 1024 1024" class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M779.5 1002.7h-535c-64.3 0-116.5-52.3-116.5-116.5V170.7h768v715.5c0 64.2-52.3 116.5-116.5 116.5zM213.3 256v630.1c0 17.2 14 31.2 31.2 31.2h534.9c17.2 0 31.2-14 31.2-31.2V256H213.3z" fill="#3688FF"></path><path d="M917.3 256H106.7C83.1 256 64 236.9 64 213.3s19.1-42.7 42.7-42.7h810.7c23.6 0 42.7 19.1 42.7 42.7S940.9 256 917.3 256zM618.7 128H405.3c-23.6 0-42.7-19.1-42.7-42.7s19.1-42.7 42.7-42.7h213.3c23.6 0 42.7 19.1 42.7 42.7S642.2 128 618.7 128zM405.3 725.3c-23.6 0-42.7-19.1-42.7-42.7v-256c0-23.6 19.1-42.7 42.7-42.7S448 403 448 426.6v256c0 23.6-19.1 42.7-42.7 42.7zM618.7 725.3c-23.6 0-42.7-19.1-42.7-42.7v-256c0-23.6 19.1-42.7 42.7-42.7s42.7 19.1 42.7 42.7v256c-0.1 23.6-19.2 42.7-42.7 42.7z" fill="#5F6379"></path></g></svg>`;
      noteOptionButton.innerHTML = `<svg class = "noteOptionImage" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <circle cx="12" cy="6" r="2" transform="rotate(90 12 6)" fill="#1280c5"></circle> <circle cx="12" cy="12" r="2" transform="rotate(90 12 12)" fill="#1280c5"></circle> <path d="M12 20C10.8954 20 10 19.1046 10 18C10 16.8954 10.8954 16 12 16C13.1046 16 14 16.8954 14 18C14 19.1046 13.1046 20 12 20Z" fill="#1280c5"></path> </g></svg>`;
      //------Click on the note -----------//
      noteButton.addEventListener("click", () => {
        textArea(note.id);
        selectedNoteId = note.id;
      });

      noteOptionButton.addEventListener("click", () => {});

      deleteNoteButton.addEventListener("click", () => {
        deleteNoteById(note.id);
      });

      noteButtonsContainer.append(noteButton);
      // noteButtonsContainer.append(deleteNoteButton);
      noteButtonsContainer.append(noteOptionButton);

      noteContainer.prepend(noteButtonsContainer);
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

      const folderButtonsContainer = document.createElement("div");
      //Add class to the folderButtonsContainer
      folderButtonsContainer.classList.add("folderButtonsContainer");

      const folderButton = document.createElement("button");
      //Add class to the folder button
      folderButton.classList.add("folderButton");

      const folderOptionContainer = document.createElement("div");
      //Add class to the folder option button
      folderOptionContainer.classList.add("folderAllOptionsContainer");

      const folderOptionButton = document.createElement("button");
      //Add class to the folder option button
      folderOptionButton.classList.add("folderOptionButton");

      const deleteFolderButton = document.createElement("button");
      //Add class to the Delete folder button
      deleteFolderButton.classList.add("deleteFolderButton");

      folderButton.innerHTML = `<svg class = "folderImage" viewBox="0 0 1024 1024" class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M242.3 743.4h603.4c27.8 0 50.3-22.5 50.3-50.3V192H192v501.1c0 27.8 22.5 50.3 50.3 50.3z" fill="#b5b5b5"></path><path d="M178.3 807.4h603.4c27.8 0 50.3-22.5 50.3-50.3V256H128v501.1c0 27.8 22.5 50.3 50.3 50.3z" fill="#d3d3cf"></path><path d="M960 515v384c0 35.3-28.7 64-64 64H128c-35.3 0-64-28.7-64-64V383.8c0-35.3 28.7-64 64-64h344.1c24.5 0 46.8 13.9 57.5 35.9l46.5 95.3H896c35.3 0 64 28.7 64 64z" fill="#1b7bb6"></path><path d="M704 512c0-20.7-1.4-41.1-4.1-61H576.1l-46.5-95.3c-10.7-22-33.1-35.9-57.5-35.9H128c-35.3 0-64 28.7-64 64V899c0 6.7 1 13.2 3 19.3C124.4 945 188.5 960 256 960c247.4 0 448-200.6 448-448z" fill="#1280c5"></path></g></svg>`;
      folderButton.innerHTML += folder.folderName;

      // deleteFolderButton.innerHTML = `<svg class = "deleteFolderImage" viewBox="0 0 1024 1024" class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M779.5 1002.7h-535c-64.3 0-116.5-52.3-116.5-116.5V170.7h768v715.5c0 64.2-52.3 116.5-116.5 116.5zM213.3 256v630.1c0 17.2 14 31.2 31.2 31.2h534.9c17.2 0 31.2-14 31.2-31.2V256H213.3z" fill="#3688FF"></path><path d="M917.3 256H106.7C83.1 256 64 236.9 64 213.3s19.1-42.7 42.7-42.7h810.7c23.6 0 42.7 19.1 42.7 42.7S940.9 256 917.3 256zM618.7 128H405.3c-23.6 0-42.7-19.1-42.7-42.7s19.1-42.7 42.7-42.7h213.3c23.6 0 42.7 19.1 42.7 42.7S642.2 128 618.7 128zM405.3 725.3c-23.6 0-42.7-19.1-42.7-42.7v-256c0-23.6 19.1-42.7 42.7-42.7S448 403 448 426.6v256c0 23.6-19.1 42.7-42.7 42.7zM618.7 725.3c-23.6 0-42.7-19.1-42.7-42.7v-256c0-23.6 19.1-42.7 42.7-42.7s42.7 19.1 42.7 42.7v256c-0.1 23.6-19.2 42.7-42.7 42.7z" fill="#5F6379"></path></g></svg>`;
      deleteFolderButton.innerHTML = "delete";

      folderOptionButton.innerHTML = `<svg class = "folderOptionImage" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <circle cx="12" cy="6" r="2" transform="rotate(90 12 6)" fill="#1280c5"></circle> <circle cx="12" cy="12" r="2" transform="rotate(90 12 12)" fill="#1280c5"></circle> <path d="M12 20C10.8954 20 10 19.1046 10 18C10 16.8954 10.8954 16 12 16C13.1046 16 14 16.8954 14 18C14 19.1046 13.1046 20 12 20Z" fill="#1280c5"></path> </g></svg>`;

      folderButton.addEventListener("click", () => {
        //All Notes Of The Folder Fetched
        fetchNotesByFolderId(folder.id);
        selectedFolderId = folder.id;
      });
      deleteFolderButton.addEventListener("click", () => {
        deleteFolderById(folder.id);
      });

      folderOptionButton.addEventListener("click", () => {
        //Toggle Visibility of the FolderOption
        if (folderOptionContainer.innerHTML === "") {
          folderOptionContainer?.appendChild(deleteFolderButton);
          // Get the position of the clicked button
          const buttonRect = folderOptionButton.getBoundingClientRect();

          // Set the position of the folderOptionContainer
          folderOptionContainer.style.top = buttonRect.bottom - 12 + "px";
          folderOptionContainer.style.left = buttonRect.left - 63 + "px";
        } else {
          folderOptionContainer.innerHTML = "";
        }
      });

      folderButtonsContainer?.append(folderButton);
      folderButtonsContainer?.append(folderOptionButton);
      // folderButtonsContainer?.append(deleteFolderButton);
      folderContainer?.prepend(folderOptionContainer);
      folderContainer?.prepend(folderButtonsContainer);
    });
  } catch (error) {
    console.log("Error fetching folders:", error);
  }
};

init();
