import express from 'express';
import CategoryController from '../controllers/CategoryController';
const router = express.Router();

router.get('/', CategoryController.index);
router.get('/create', CategoryController.create);
router.post('/create', CategoryController.store);
router.get('/:id', CategoryController.show);
router.post('/:id/edit', CategoryController.update);
router.delete('/:id', CategoryController.destroy);
router.get('/:id/edit', CategoryController.edit);


export { router as CategoriesRouter }
