import axios from "axios";
import { debounceUpdatedNotes } from "../main";

export const noteArea = document.getElementById("noteArea") as HTMLElement;

//--------------------- Text Area ---------------------------------//
export const textArea = async (noteId: number) => {
  try {
    const response = await axios.get(
      `http://localhost:8000/notearea/${noteId}`
    );

    const noteData = await response.data;
    console.log(noteData.title);
    noteArea.innerHTML = "";

    const textarea = document.createElement("textarea");

    // Populate the textarea with the previous content
    textarea.value = noteData.content;

    //--------------------------------Update Notes --------------------------------//
    textarea.addEventListener("input", async (): Promise<void> => {
      await debounceUpdatedNotes(noteId, textarea.value);
      textarea.focus();
    });

    noteArea.appendChild(textarea);

    // Get existing button by ID
    const exportButton = document.getElementById("exportButton")!;

    // Define export button handler
    const exportButtonHandler = async () => {
      exportTextAreaContent(textarea, noteData.title);
      exportButton.removeEventListener("click", exportButtonHandler);
    };

    // Attach click event listener to existing button
    if (exportButton) {
      exportButton.addEventListener("click", exportButtonHandler);
    } else {
      console.error("Button with id 'exportButton' not found in the HTML.");
    }
  } catch (error) {
    console.log("Error fetching notes:", error);
  }
};

// Function to export textarea content as a text file
const exportTextAreaContent = (
  textarea: HTMLTextAreaElement,
  fileName: string
) => {
  const blob = new Blob([textarea.value], { type: "text/plain" });
  const link = document.createElement("a");

  link.href = URL.createObjectURL(blob);
  link.download = `${fileName}.txt`;

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
};
