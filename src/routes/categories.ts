import express from 'express';
import CategoryController from '../controllers/CategoryController';
const router = express.Router();

router.get('/', CategoryController.index);
router.get('/create', CategoryController.create);
router.post('/', CategoryController.store);
router.get('/:id', CategoryController.show);
router.patch('/:id', CategoryController.update);
router.delete('/:id', CategoryController.destroy);
router.get('/:id/edit', CategoryController.edit);


export { router as CategoriesRouter }
