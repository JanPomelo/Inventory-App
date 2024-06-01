import express from 'express';
import ItemController from '../controllers/ItemController';
const router = express.Router();

router.get('/', ItemController.index);
router.get('/:id', ItemController.show);
router.post('/', ItemController.create);
router.put('/:id', ItemController.update);
router.delete('/:id', ItemController.destroy);
router.post('/store', ItemController.store);
router.get('/:id/edit', ItemController.edit);

export { router as ItemsRouter }


