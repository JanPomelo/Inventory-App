import { Request, Response, NextFunction } from 'express';
import Category from '../models/Category';
import Item from '../models/Item';
import { body, validationResult } from 'express-validator';
import EnvVars from '@src/constants/EnvVars';

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
    res.render('categories/form', { title: 'Create Category' })
  }

  const update = [
    body('name', 'Name must have at least 3 characters')
      .trim()
      .isLength({ min: 3 })
      .escape(),
    body('description', 'Description must have at least 3 characters')
      .trim()
      .isLength({ min: 3 })
      .escape(),
    async (req: Request, res: Response, next: NextFunction) => {

    const category = new Category({
      name: req.body.name,
      description: req.body.description,
      _id: req.params.id
    });

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render('categories/form', {
        title: 'Edit Category',
        category: category,
        errors: errors.array()
      });
      return;
    } else {
      try {
        await Category.findByIdAndUpdate(req.params.id, category).exec();
        res.redirect(category.url);
      } catch (err) {
        next(err);
      }
    }
  }];

  const destroy_get = async (req: Request, res: Response, next: NextFunction) => {
    const [category, items] = await Promise.all([
      Category.findById(req.params.id).exec(),
      Item.find({ category: req.params.id }).exec()
    ]);

    if (!category) {
      res.status(404).send('Category not found');
      return;
    }

    res.render('categories/delete', { title: 'Delete Category', category: category, items: items });
  };

  const destroy_post = [
    body('admin_pw', 'Admin Password Required')
      .escape()
      .trim()
      .custom((value, { req }) => {
        if (value === EnvVars.AdminPassword) {
          return true;
        } else {
          return false;
        }
      }).withMessage('Wrong Admin Password'),
    async (req: Request, res: Response, next: NextFunction) => {
    const [category, items] = await Promise.all([
      Category.findById(req.params.id).exec(),
      Item.find({ category: req.params.id }).exec(),
    ]);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render('categories/delete', { title: 'Delete Category', category: category, items: items, errors: errors.array() });
    }

    if (items.length > 0) {
      res.render("categories.delete", {
        title: "Delete Category",
        category: category,
        items: items,
      });
      return;
    } else {
      try {
        await Category.findByIdAndDelete(req.body.id).exec();
        res.redirect("/categories");
      } catch (err) {
        next(err);
      }
    }
  }];

  const store = [
    body('name', 'Name must have at least 3 characters')
      .trim()
      .isLength({ min: 3 })
      .escape(),
    body('description', 'Description must have at least 3 characters')
      .trim()
      .isLength({ min: 3 })
      .escape(),
    async (req: Request, res: Response, next: NextFunction) => {

      const errors = validationResult(req);

      const category = new Category({
        name: req.body.name,
        description: req.body.description
      });

      if (!errors.isEmpty()) {
        res.render('categories/form', {
          title: 'Create Category',
          category: category,
          errors: errors.array()
        });
        return;
      } else {
        try {
          await category.save();
          res.redirect(category.url);
        } catch (err) {
          next(err);
        }
      }
  }];

  const edit = async (req: Request, res: Response, next: NextFunction) => {
    const category = await Category.findById(req.params.id).exec();

    if (!category) {
      res.status(404).send('Category not found');
      return;
    }

    res.render('categories/form', { title: 'Edit Category', category: category });
  }

  return {
    index,
    show,
    create,
    update,
    destroy_get,
    destroy_post,
    store,
    edit
  }
})();

export default CategoryController;
