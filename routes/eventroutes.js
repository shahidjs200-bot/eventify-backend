import express from 'express';
import { protect } from '../middleware/authmiddleware.js';
import { CreateEvent , deleteEvent, getMyevents, searchEvent, SingleEvent, UpdateEvent } from '../controller/eventcontroller.js';
import upload from '../middleware/upload.js';
const router = express.Router();

router.post('/',protect,upload.single("image"),CreateEvent);
router.get('/my-events', protect , getMyevents)
router.delete('/:id',protect, deleteEvent);
router.get('/:id',SingleEvent);
router.put('/:id',protect,upload.single('image'),UpdateEvent);
router.get('/',searchEvent);

 export default router;