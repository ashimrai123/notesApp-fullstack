import axios from "axios";
import { initializePage } from "../main";
// import { userId } from "../user/login";

export async function createFolder(folderName: string, userId: any) {
  //Make a POST request to create a new note
  axios
    .post(`http://localhost:8000/folder/${userId}`, { folder_name: folderName })
    .then((response) => {
      console.log("Folder created successfully: ", response.data);
    })
    .catch((error) => {
      console.error("Error creating folder", error.response.data);
    });
}

export const deleteFolderById = async (folderId: number, userId: any) => {
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
