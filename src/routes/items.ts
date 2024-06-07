import express from 'express';
import ItemController from '../controllers/ItemController';
const router = express.Router();

router.get('/', ItemController.index);
router.get('/create', ItemController.create);
router.post('/create', ItemController.store);
router.get('/:id', ItemController.show);
router.get('/:id/edit', ItemController.edit);
router.post('/:id/edit', ItemController.update);
router.get('/:id/delete', ItemController.destroy_get);
router.post('/:id/delete', ItemController.destroy_post);
export { router as ItemsRouter };


