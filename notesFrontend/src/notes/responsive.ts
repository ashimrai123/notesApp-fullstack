//Responsive

const notesNav = document.querySelector(".notesNav") as HTMLElement;
const mainNote = document.querySelector(".mainNote") as HTMLElement;
const folderNav = document.querySelector(".folderNav") as HTMLElement;
export const backToNotesButton = document.querySelector(
  ".toolbar__backToNotes"
) as HTMLButtonElement;
backToNotesButton.addEventListener("click", () => {
  mainNote.style.display = "none";
  notesNav.style.display = "block";
});

export const backToFolders = document.querySelector(
  ".backToFolders"
) as HTMLElement;
backToFolders.addEventListener("click", () => {
  notesNav.style.display = "none";
  folderNav.style.display = "block";
});

// Assume you have a container for note buttons like this:
export const noteButtonsContainer = document.querySelector(
  "#noteContainer"
) as HTMLElement;

// Add event listener to each note button
noteButtonsContainer?.addEventListener("click", (event) => {
  // Check if the clicked element is a note button
  const target = event?.target as HTMLElement;
  if (target && target.classList.contains("noteButton")) {
    // Hide folderNav
    folderNav.style.display = "none";

    // Show notesNav and mainNote
    notesNav.style.display = "block";
    mainNote.style.display = "block";
  }
});
