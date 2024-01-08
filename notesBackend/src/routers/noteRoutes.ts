import express from 'express';
import * as controller from '../controllers/noteController';

const router = express.Router();

router.get('/note',controller.getAllNotes);
router.post('/note', controller.createNote);
router.get('/note/:title', controller.getNoteByTitle);


export default router;