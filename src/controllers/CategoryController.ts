import { Request, Response, NextFunction } from 'express';
import Category from '../models/Category';
import Item from '../models/Item';

const CategoryController = (() => {

  const index = async (req: Request, res: Response, next: NextFunction) => {
    const categories = await Category.find().exec();

    res.render('categories/index', { title: "Categories", categories: categories });
  }

  const show = async (req: Request, res: Response, next: NextFunction) => {
    const [category, items] = await Promise.all([
      Category.findById(req.params.id).exec(),
      Item.find({ category: req.params.id }).exec()
    ]);

    if (!category) {
      res.status(404).send('Category not found');
      return;
    }

    res.render('categories/show', { title: category.name, category: category, items: items });
  }

  const create = async (req: Request, res: Response, next: NextFunction) => {
    res.render('categories/create', { title: 'Create Category' })
  }

  const update = async (req: Request, res: Response, next: NextFunction) => {
    res.send('Update Category');
  }

  const destroy = async (req: Request, res: Response, next: NextFunction) => {
    res.send('Delete Category');
  }

  const store = async (req: Request, res: Response, next: NextFunction) => {
    res.send('Store Category');
  }

  const edit = async (req: Request, res: Response, next: NextFunction) => {
    res.send('Edit Category');
  }

  return {
    index,
    show,
    create,
    update,
    destroy,
    store,
    edit
  }
})();

export default CategoryController;
