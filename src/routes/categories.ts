import express from 'express';
import CategoryController from '../controllers/CategoryController';
const router = express.Router();

router.get('/', CategoryController.index);
router.get('/:id', CategoryController.show);
router.post('/', CategoryController.create);
router.put('/:id', CategoryController.update);
router.delete('/:id', CategoryController.destroy);
router.post('/store', CategoryController.store);
router.get('/:id/edit', CategoryController.edit);


export { router as CategoriesRouter }
