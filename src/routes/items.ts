import express from 'express';
import ItemController from '../controllers/ItemController';
const router = express.Router();

router.get('/', ItemController.index);
router.get('/create', ItemController.create);
router.post('/', ItemController.store);
router.get('/:id', ItemController.show);
router.patch('/:id', ItemController.update);
router.delete('/:id', ItemController.destroy);
router.get('/:id/edit', ItemController.edit);

export { router as ItemsRouter }


