import { Request, Response, NextFunction } from 'express';
import Category from '../models/Category';

const CategoryController = (() => {

  const index = async (req: Request, res: Response, next: NextFunction) => {
    const categories = await Category.find().exec();

    res.render('categories/index', { title: "Categories", categories: categories });
  }

  const show = async (req: Request, res: Response, next: NextFunction) => {
    res.send('Category Details');
  }

  const create = async (req: Request, res: Response, next: NextFunction) => {
    res.send('Create Category');
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
