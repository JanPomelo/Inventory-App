import { Request, Response, NextFunction } from 'express';
import Item from '../models/Item';

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
    res.send('Create Item');
  };

  const update = async (req: Request, res: Response, next: NextFunction) => {
    res.send('Update Item');
  };

  const destroy = async (req: Request, res: Response, next: NextFunction) => {
    res.send('Delete Item');
  };

  const store = async (req: Request, res: Response, next: NextFunction) => {
    res.send('Store Item');
  };

  const edit = async (req: Request, res: Response, next: NextFunction) => {
    res.send('Edit Item');
  };

  return {
    index,
    show,
    create,
    update,
    destroy,
    store,
    edit
  };
})();

export default ItemController;
