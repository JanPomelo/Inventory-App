import express from 'express';
import ItemController from '../controllers/ItemController';
const router = express.Router();

router.get('/', ItemController.index);
router.get('/create', ItemController.create);
router.post('/create', ItemController.store);
router.get('/:id', ItemController.show);
router.delete('/:id', ItemController.destroy);
router.get('/:id/edit', ItemController.edit);
router.post('/:id/edit', ItemController.update);

export { router as ItemsRouter }


