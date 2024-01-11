import express from "express";
import * as controller from "../controllers/noteController";

const router = express.Router();

router.get("/note", controller.getAllNotes);
router.get("/folder", controller.getAllFolders);
router.post("/note", controller.createNote);
router.post("/folder", controller.createFolder);
router.get("/note/:id", controller.getAllNotesByFolderId);

export default router;
