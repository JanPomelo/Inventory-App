import { Request, Response, NextFunction } from 'express';
import Item from '../models/Item';
import Category from '../models/Category';
import { body, validationResult } from 'express-validator';

const ItemController = (() => {

  const index = async (req: Request, res: Response, next: NextFunction) => {
    const items = await Item.find().exec();

    res.render('items/index', { title: "Items", items: items });
  };

  const show = async (req: Request, res: Response, next: NextFunction) => {
    const item = await Item.findById(req.params.id).populate('category').exec();

    if (!item) {
      res.status(404).send('Item not found');
      return;
    }

    res.render('items/show', { title: item.name, item: item });
  };

  const create = async (req: Request, res: Response, next: NextFunction) => {
    const categories = await Category.find().sort( {"name": 1} ).exec();

    res.render('items/form', { title: 'Create Item', categories: categories });
  };

  const update = [
    body('name', 'Name is required')
      .trim()
      .isLength({ min: 3 }).withMessage('Name must have at least 3 characters')
      .escape(),
    body('description', 'Description is required')
      .trim()
      .isLength({ min: 3 }).withMessage('Description must have at least 3 characters')
      .escape(),
    body('price', 'Price is required')
      .isFloat( { min: 0 }).withMessage('Price must be a positive number')
      .escape(),
    body('number_in_stock', 'Number in stock is required')
      .isInt( { min: 0}).withMessage('Number in stock must be a positive integer')
      .escape(),
    body('category', 'Category is required')
      .isLength({ min: 1 })
      .escape(),
    async (req: Request, res: Response, next: NextFunction) => {
      const item = new Item({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        number_in_stock: req.body.number_in_stock,
        category: req.body.category,
        _id: req.params.id
      });

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const categories = await Category.find().sort( {"name": 1} ).exec();

        res.render('items/form', {
          title: 'Edit Item',
          item: item,
          categories: categories,
          errors: errors.array()
        });
        return;
      } else {
        try {
          await Item.findByIdAndUpdate(req.params.id, item).exec();
          res.redirect(item.url)
        } catch (err) {
          next(err);
        }
      }
  }];

  const destroy_get = async (req: Request, res: Response, next: NextFunction) => {
    const item = await Item.findById(req.params.id).exec();

    if (!item) {
      res.status(404).send('Item not found');
      return;
    }

    res.render('items/delete', { title: 'Delete Item', item: item });
  };

  const destroy_post = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await Item.findByIdAndDelete(req.body.id).exec();
      res.redirect('/items');
    } catch(err) {
      next(err);
    }
  };

  const store = [
    body('name', 'Name is required')
      .trim()
      .isLength({ min: 3 }).withMessage('Name must have at least 3 characters')
      .escape(),
    body('description', 'Description is required')
      .trim()
      .isLength({ min: 3 }).withMessage('Description must have at least 3 characters')
      .escape(),
    body('price', 'Price is required')
      .isFloat( { min: 0 }).withMessage('Price must be a positive number')
      .escape(),
    body('number_in_stock', 'Number in stock is required')
      .isInt( { min: 0}).withMessage('Number in stock must be a positive integer')
      .escape(),
    body('category', 'Category is required')
      .isLength({ min: 1 })
      .escape(),
    async (req: Request, res: Response, next: NextFunction) => {

      const item = new Item({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        number_in_stock: req.body.number_in_stock,
        category: req.body.category
      });

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const categories = await Category.find().sort( {"name": 1} ).exec();

        res.render('items/form', {
          title: 'Create Item',
          item: item,
          categories: categories,
          errors: errors.array()
        });
        return;
      } else {
        try {
          await item.save();
          res.redirect(item.url);
        } catch (err) {
          next(err);
        }
      }
  }];

  const edit = async (req: Request, res: Response, next: NextFunction) => {
    const [item, categories] = await Promise.all([
      Item.findById(req.params.id).exec(),
      Category.find().sort( {"name": 1} ).exec()
    ]);

    if (!item) {
      res.status(404).send('Item not found');
      return;
    }

    res.render('items/form', { title: 'Edit Item', item: item, categories: categories });
  };

  return {
    index,
    show,
    create,
    update,
    destroy_get,
    destroy_post,
    store,
    edit
  };
})();

export default ItemController;
