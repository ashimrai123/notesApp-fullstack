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
    .getElementById("folderNameInput")
    ?.addEventListener("keydown", async (event) => {
      if (event.key === "Enter") {
        // If the pressed key is Enter, create the folder
        const folderNameInput = document.getElementById(
          "folderNameInput"
        ) as HTMLInputElement;
        const folderName = folderNameInput.value;

        if (folderName !== "") {
          await createFolder(folderName);
          folderNameInput.value = ""; // Clear the input field after successful folder creation
        } else {
          console.log("Input field is empty");
        }

        // Giving some delay to give a little time for the database operation
        setTimeout(async () => {
          await initializePage();
        }, 100);
      }
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

      const noteOptionContainer = document.createElement("div");
      //Add class to the noteOPtionContainer
      noteOptionContainer.classList.add("noteAllOptionsContainer");

      const noteOptionButton = document.createElement("button");
      // Add class to the noteOptionButton
      noteOptionButton.classList.add("noteOptionButton");

      const deleteNoteButton = document.createElement("button");
      // Add class to the noteButton
      deleteNoteButton.classList.add("deleteNoteButton");

      const pinNoteButton = document.createElement("button");
      //Add class to the pinNoteButton
      pinNoteButton.classList.add("pinNoteButton");

      const lockNoteButton = document.createElement("button");
      //Add class to the lockNoteButton
      lockNoteButton.classList.add("lockNoteButton");

      noteButton.innerHTML = note.title;
      deleteNoteButton.innerHTML = ` <svg class = "deleteNoteImage" fill="#1280c5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M5.755,20.283,4,8H20L18.245,20.283A2,2,0,0,1,16.265,22H7.735A2,2,0,0,1,5.755,20.283ZM21,4H16V3a1,1,0,0,0-1-1H9A1,1,0,0,0,8,3V4H3A1,1,0,0,0,3,6H21a1,1,0,0,0,0-2Z"></path></g></svg> Delete`;

      pinNoteButton.innerHTML = `<svg class = "pinNoteImage" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M19.1835 7.80516L16.2188 4.83755C14.1921 2.8089 13.1788 1.79457 12.0904 2.03468C11.0021 2.2748 10.5086 3.62155 9.5217 6.31506L8.85373 8.1381C8.59063 8.85617 8.45908 9.2152 8.22239 9.49292C8.11619 9.61754 7.99536 9.72887 7.86251 9.82451C7.56644 10.0377 7.19811 10.1392 6.46145 10.3423C4.80107 10.8 3.97088 11.0289 3.65804 11.5721C3.5228 11.8069 3.45242 12.0735 3.45413 12.3446C3.45809 12.9715 4.06698 13.581 5.28476 14.8L6.69935 16.2163L2.22345 20.6964C1.92552 20.9946 1.92552 21.4782 2.22345 21.7764C2.52138 22.0746 3.00443 22.0746 3.30236 21.7764L7.77841 17.2961L9.24441 18.7635C10.4699 19.9902 11.0827 20.6036 11.7134 20.6045C11.9792 20.6049 12.2404 20.5358 12.4713 20.4041C13.0192 20.0914 13.2493 19.2551 13.7095 17.5825C13.9119 16.8472 14.013 16.4795 14.2254 16.1835C14.3184 16.054 14.4262 15.9358 14.5468 15.8314C14.8221 15.593 15.1788 15.459 15.8922 15.191L17.7362 14.4981C20.4 13.4973 21.7319 12.9969 21.9667 11.9115C22.2014 10.826 21.1954 9.81905 19.1835 7.80516Z" fill="#1280c5"></path> </g></svg> Pin Note`;
      lockNoteButton.innerHTML = `<svg class = "lockNoteImage" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M5.5 10V7C5.5 5.27609 6.18482 3.62279 7.40381 2.40381C8.62279 1.18482 10.2761 0.5 12 0.5C13.7239 0.5 15.3772 1.18482 16.5962 2.40381C17.8152 3.62279 18.5 5.27609 18.5 7V10H19C20.6569 10 22 11.3431 22 13V20C22 21.6569 20.6569 23 19 23H5C3.34315 23 2 21.6569 2 20V13C2 11.3431 3.34315 10 5 10H5.5ZM9.52513 4.52513C10.1815 3.86875 11.0717 3.5 12 3.5C12.9283 3.5 13.8185 3.86875 14.4749 4.52513C15.1313 5.1815 15.5 6.07174 15.5 7V10H8.5V7C8.5 6.07174 8.86875 5.1815 9.52513 4.52513Z" fill="#1280c5"></path> </g></svg>Lock Note`;
      noteOptionButton.innerHTML = `<svg class = "noteOptionImage" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <circle cx="12" cy="6" r="2" transform="rotate(90 12 6)" fill="#1280c5"></circle> <circle cx="12" cy="12" r="2" transform="rotate(90 12 12)" fill="#1280c5"></circle> <path d="M12 20C10.8954 20 10 19.1046 10 18C10 16.8954 10.8954 16 12 16C13.1046 16 14 16.8954 14 18C14 19.1046 13.1046 20 12 20Z" fill="#1280c5"></path> </g></svg>`;
      //------Click on the note -----------//
      noteButton.addEventListener("click", () => {
        //Selected Folder Colored
        if (previousNoteButton) {
          previousNoteButton.style.backgroundColor = "";
          previousNoteButton.style.color = "";
        }
        // noteButton.style.backgroundColor = "#0a4a6e";
        noteButton.style.backgroundColor = "#0e649a";

        noteButton.style.color = "#ffffff";

        previousNoteButton = noteButton;

        textArea(note.id);
        selectedNoteId = note.id;
      });

      noteOptionButton.addEventListener("click", () => {
        if (noteOptionContainer.innerHTML === "") {
          noteOptionContainer?.appendChild(deleteNoteButton);
          noteOptionContainer?.appendChild(pinNoteButton);
          noteOptionContainer?.appendChild(lockNoteButton);
          //Get the position of the clicked button
          const buttonRect = noteOptionButton.getBoundingClientRect();

          //set the position fo the noteOptionContainer
          noteOptionContainer.style.top = buttonRect.bottom - 46 + "px";
          noteOptionContainer.style.left = buttonRect.left - 140 + "px";
        } else {
          noteOptionContainer.innerHTML = "";
        }
      });

      deleteNoteButton.addEventListener("click", () => {
        deleteNoteById(note.id);
      });

      //-------------------------- HIDE THE OPTIONS WHEN CLICKED ELSEWHERE ------------------------------------------------------------//
      document.addEventListener("click", (event) => {
        if (
          //Check if the click is outside noteOptionButton
          noteOptionButton && // check if noteOptionButton is not null and exists
          !(noteOptionButton as Node).contains(event.target as Node) //check if click is outside the noteOptionButton
        ) {
          // Check if the click is also outside the noteOptionContainer
          if (
            noteOptionContainer && // check if noteOptionContainer is not null and exists
            !(noteOptionContainer as Node).contains(event.target as Node) // check if click is outside the noteOptionContainer
          ) {
            // Hide the folderOptionContainer
            noteOptionContainer.innerHTML = "";
          }
        }
      });

      noteButtonsContainer.append(noteButton);
      noteButtonsContainer.append(noteOptionButton);

      //Everything is inside the folderContainer including the dropdown
      noteContainer?.prepend(noteOptionContainer); //Folder Button inside the folderContainer
      noteContainer?.prepend(noteButtonsContainer); //Dropdown inside the folderContainer
    });
  } catch (error) {
    console.log("Error fetching notes:", error);
  }
};

//--------------------Initialize the page contents---------------------------//
let previousFolderButton: HTMLButtonElement | null = null;
let previousNoteButton: HTMLButtonElement | null = null;

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

      const renameFolderButton = document.createElement("button");
      //Add class to the Delete folder button
      renameFolderButton.classList.add("renameFolderButton");

      folderButton.innerHTML = `<svg class = "folderImage" viewBox="0 0 1024 1024" class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M242.3 743.4h603.4c27.8 0 50.3-22.5 50.3-50.3V192H192v501.1c0 27.8 22.5 50.3 50.3 50.3z" fill="#b5b5b5"></path><path d="M178.3 807.4h603.4c27.8 0 50.3-22.5 50.3-50.3V256H128v501.1c0 27.8 22.5 50.3 50.3 50.3z" fill="#d3d3cf"></path><path d="M960 515v384c0 35.3-28.7 64-64 64H128c-35.3 0-64-28.7-64-64V383.8c0-35.3 28.7-64 64-64h344.1c24.5 0 46.8 13.9 57.5 35.9l46.5 95.3H896c35.3 0 64 28.7 64 64z" fill="#1b7bb6"></path><path d="M704 512c0-20.7-1.4-41.1-4.1-61H576.1l-46.5-95.3c-10.7-22-33.1-35.9-57.5-35.9H128c-35.3 0-64 28.7-64 64V899c0 6.7 1 13.2 3 19.3C124.4 945 188.5 960 256 960c247.4 0 448-200.6 448-448z" fill="#1280c5"></path></g></svg>`;
      folderButton.innerHTML += folder.folderName;

      // deleteFolderButton.innerHTML = `<svg class = "deleteFolderImage" viewBox="0 0 1024 1024" class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M779.5 1002.7h-535c-64.3 0-116.5-52.3-116.5-116.5V170.7h768v715.5c0 64.2-52.3 116.5-116.5 116.5zM213.3 256v630.1c0 17.2 14 31.2 31.2 31.2h534.9c17.2 0 31.2-14 31.2-31.2V256H213.3z" fill="#3688FF"></path><path d="M917.3 256H106.7C83.1 256 64 236.9 64 213.3s19.1-42.7 42.7-42.7h810.7c23.6 0 42.7 19.1 42.7 42.7S940.9 256 917.3 256zM618.7 128H405.3c-23.6 0-42.7-19.1-42.7-42.7s19.1-42.7 42.7-42.7h213.3c23.6 0 42.7 19.1 42.7 42.7S642.2 128 618.7 128zM405.3 725.3c-23.6 0-42.7-19.1-42.7-42.7v-256c0-23.6 19.1-42.7 42.7-42.7S448 403 448 426.6v256c0 23.6-19.1 42.7-42.7 42.7zM618.7 725.3c-23.6 0-42.7-19.1-42.7-42.7v-256c0-23.6 19.1-42.7 42.7-42.7s42.7 19.1 42.7 42.7v256c-0.1 23.6-19.2 42.7-42.7 42.7z" fill="#5F6379"></path></g></svg>`;
      deleteFolderButton.innerHTML = ` <svg class = "deleteFolderImage" fill="#1280c5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M5.755,20.283,4,8H20L18.245,20.283A2,2,0,0,1,16.265,22H7.735A2,2,0,0,1,5.755,20.283ZM21,4H16V3a1,1,0,0,0-1-1H9A1,1,0,0,0,8,3V4H3A1,1,0,0,0,3,6H21a1,1,0,0,0,0-2Z"></path></g></svg> Delete`;

      renameFolderButton.innerHTML = `<svg class = "renameFolderImage" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path opacity="0.5" d="M20.8487 8.71306C22.3844 7.17735 22.3844 4.68748 20.8487 3.15178C19.313 1.61607 16.8231 1.61607 15.2874 3.15178L14.4004 4.03882C14.4125 4.0755 14.4251 4.11268 14.4382 4.15035C14.7633 5.0875 15.3768 6.31601 16.5308 7.47002C17.6848 8.62403 18.9133 9.23749 19.8505 9.56262C19.888 9.57563 19.925 9.58817 19.9615 9.60026L20.8487 8.71306Z" fill="#1280c5"></path> <path d="M14.4386 4L14.4004 4.03819C14.4125 4.07487 14.4251 4.11206 14.4382 4.14973C14.7633 5.08687 15.3768 6.31538 16.5308 7.4694C17.6848 8.62341 18.9133 9.23686 19.8505 9.56199C19.8876 9.57489 19.9243 9.58733 19.9606 9.59933L11.4001 18.1598C10.823 18.7369 10.5343 19.0255 10.2162 19.2737C9.84082 19.5665 9.43469 19.8175 9.00498 20.0223C8.6407 20.1959 8.25351 20.3249 7.47918 20.583L3.39584 21.9442C3.01478 22.0712 2.59466 21.972 2.31063 21.688C2.0266 21.4039 1.92743 20.9838 2.05445 20.6028L3.41556 16.5194C3.67368 15.7451 3.80273 15.3579 3.97634 14.9936C4.18114 14.5639 4.43213 14.1578 4.7249 13.7824C4.97307 13.4643 5.26165 13.1757 5.83874 12.5986L14.4386 4Z" fill="#1280c5"></path> </g></svg>Rename`;

      folderOptionButton.innerHTML = `<svg class = "folderOptionImage" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <circle cx="12" cy="6" r="2" transform="rotate(90 12 6)" fill="#1280c5"></circle> <circle cx="12" cy="12" r="2" transform="rotate(90 12 12)" fill="#1280c5"></circle> <path d="M12 20C10.8954 20 10 19.1046 10 18C10 16.8954 10.8954 16 12 16C13.1046 16 14 16.8954 14 18C14 19.1046 13.1046 20 12 20Z" fill="#1280c5"></path> </g></svg>`;

      folderButton.addEventListener("click", () => {
        //Selected Folder Colored
        if (previousFolderButton) {
          previousFolderButton.style.backgroundColor = "";
          previousFolderButton.style.color = "";
        }
        folderButton.style.backgroundColor = "#0e649a";
        folderButton.style.color = "#ffffff";

        previousFolderButton = folderButton;
        //All Notes Of The Folder Fetched
        fetchNotesByFolderId(folder.id);
        selectedFolderId = folder.id;
      });

      deleteFolderButton.addEventListener("click", () => {
        deleteFolderById(folder.id);
      });

      renameFolderButton.addEventListener("click", () => {
        // renameFolderById(folder.id);
      });

      folderOptionButton.addEventListener("click", () => {
        //Toggle Visibility of the FolderOption
        if (folderOptionContainer.innerHTML === "") {
          folderOptionContainer?.appendChild(deleteFolderButton);
          folderOptionContainer?.appendChild(renameFolderButton);
          // Get the position of the clicked button
          const buttonRect = folderOptionButton.getBoundingClientRect();

          // Set the position of the folderOptionContainer
          folderOptionContainer.style.top = buttonRect.bottom - 53 + "px";
          folderOptionContainer.style.left = buttonRect.left - 122 + "px";
        } else {
          folderOptionContainer.innerHTML = "";
        }
      });

      //-------------------------- HIDE THE OPTIONS WHEN CLICKED ELSEWHERE ------------------------------------------------------------//
      document.addEventListener("click", (event) => {
        if (
          //Check if the click is outside folderOptionButton
          folderOptionButton && // check if folderOptionButton is not null and exists
          !(folderOptionButton as Node).contains(event.target as Node) //check if click is outside the folderOptionButton
        ) {
          // Check if the click is also outside the folderOptionContainer
          if (
            folderOptionContainer && // check if folderOptionContainer is not null and exists
            !(folderOptionContainer as Node).contains(event.target as Node) // check if click is outside the folderOPtionContainer
          ) {
            // Hide the folderOptionContainer
            folderOptionContainer.innerHTML = "";
          }
        }
      });

      folderButtonsContainer?.append(folderButton);
      folderButtonsContainer?.append(folderOptionButton);
      //Everything is inside the folderContainer including the dropdown
      folderContainer?.prepend(folderButtonsContainer); //Folder Button inside the folderContainer
      folderContainer?.prepend(folderOptionContainer); //Dropdown inside the folderContainer
    });
  } catch (error) {
    console.log("Error fetching folders:", error);
  }
};

init();
