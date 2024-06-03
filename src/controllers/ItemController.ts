import { Request, Response, NextFunction } from 'express';
import Item from '../models/Item';
import IItem from '../interfaces/Item';
import Category from '../models/Category';
import { body, validationResult } from 'express-validator';
import EnvVars from '../constants/EnvVars';
import multer from 'multer';
const storage = multer.diskStorage({
  filename: function (req: Request,file,cb) {
    cb(null, file.originalname)
  }
});
const upload = multer({storage: storage});

import cloudinary from 'cloudinary';
cloudinary.v2.config({
  cloud_name: EnvVars.Cloudinary.AppName,
  api_key: EnvVars.Cloudinary.ApiKey,
  api_secret: EnvVars.Cloudinary.ApiSecret
});

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
    upload.single('img'),
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
        _id: req.params.id,
        img: req.file ? req.file.filename : undefined
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
          if (req.file) {
            const oldItem = await Item.findById(req.params.id).exec() as IItem;
            const result = await cloudinary.v2.uploader.upload(req.file.path);
            item.img = result.secure_url; // Update the img field with the secure URL
            if (oldItem.img) {
              await cloudinary.v2.uploader.destroy(oldItem.img.substring(oldItem.img.lastIndexOf('/') + 1, oldItem.img.lastIndexOf('.')));
            }
            await Item.findByIdAndUpdate(req.params.id, item).exec();
            res.redirect('/items'); // Redirect to the items list or another appropriate page
          } else {
            await Item.findByIdAndUpdate(req.params.id, { name: item.name,
              description: item.description,
              price: item.price,
              number_in_stock: item.number_in_stock,
              category: item.category,
              _id: item._id,
            }).exec();
            res.redirect('/items'); // Redirect to the items list or another appropriate page
          }
        } catch (err) {
          console.error('Error creating item:', err);
          const categories = await Category.find().sort({ "name": 1 }).exec();
          res.render('items/form', {
            title: 'Create Item',
            item: item,
            categories: categories,
            errors: [{ msg: 'An error occurred while creating the item' }]
          });
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
      await cloudinary.v2.uploader.destroy(req.body.img_id);
      await Item.findByIdAndDelete(req.body.id).exec();
      res.redirect('/items');
    } catch(err) {
      next(err);
    }
  };

  const store = [
    upload.single('img'),
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
    body('img', 'Image is required')
      .custom((value, { req }) => {
        if (!req.file) {
          return false;
        }
        return true;
      }),
    async (req: Request, res: Response, next: NextFunction) => {

      const item = new Item({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        number_in_stock: req.body.number_in_stock,
        category: req.body.category,
        img: req.file ? req.file.filename : undefined
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
          if (req.file) {
            const result = await cloudinary.v2.uploader.upload(req.file.path);
            item.img = result.secure_url; // Update the img field with the secure URL
            console.log(item.img);
          }

          await item.save(); // Save the item after the image upload is complete
          res.redirect('/items'); // Redirect to the items list or another appropriate page
        } catch (err) {
          console.error('Error creating item:', err);
          const categories = await Category.find().sort({ "name": 1 }).exec();
          res.render('items/form', {
            title: 'Create Item',
            item: item,
            categories: categories,
            errors: [{ msg: 'An error occurred while creating the item' }]
          });
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
