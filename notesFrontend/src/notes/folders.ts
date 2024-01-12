import axios from "axios";

export async function createFolder(folderName: string) {
  //Make a POST request to create a new note
  axios
    .post("http://localhost:8000/folder", { folder_name: folderName })
    .then((response) => {
      console.log("Folder created successfully: ", response.data);
    })
    .catch((error) => {
      console.error("Error creating folder", error.response.data);
    });
}
