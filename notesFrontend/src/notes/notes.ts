import axios from "axios";

export async function createNote(folder_id: number) {
  // Create a note container
  //   const noteContainer = document.getElementById("noteContainer");

  //   // Create a textarea for the user to enter content
  //   const textArea = document.createElement("textarea");
  //   textArea.rows = 5;
  //   textArea.cols = 30;

  //   // Append the textarea to the note container
  //   noteContainer?.appendChild(textArea);

  // Make a POST request to create a new note
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
