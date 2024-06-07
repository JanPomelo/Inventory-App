import express from 'express';
import CategoryController from '../controllers/CategoryController';
const router = express.Router();

router.get('/', CategoryController.index);
router.get('/create', CategoryController.create);
router.post('/create', CategoryController.store);
router.get('/:id', CategoryController.show);
router.get('/:id/edit', CategoryController.edit);
router.post('/:id/edit', CategoryController.update);
router.get('/:id/delete', CategoryController.destroy_get);
router.post('/:id/delete', CategoryController.destroy_post);


export { router as CategoriesRouter };
