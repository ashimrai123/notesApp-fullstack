import express from "express";
import * as controller from "../controllers/noteController";

const router = express.Router();

router.get("/note", controller.getAllNotes);
router.get("/folder/:id", controller.getAllFolders);
router.post("/note", controller.createNote);
router.post("/folder/:id", controller.createFolder);
router.get("/note/:id", controller.getAllNotesByFolderId);
router.get("/notearea/:noteId", controller.getNoteById);
router.put("/updateNote/:id", controller.updateNote);
router.delete("/note/:id", controller.deleteNote);
router.delete("/folder/:id", controller.deleteFolder);

export default router;
