import { Request, Response, NextFunction } from 'express';

const ItemController = (() => {

  const index = async (req: Request, res: Response, next: NextFunction) => {
    res.send('All Items');
  };

  const show = async (req: Request, res: Response, next: NextFunction) => {
    res.send('Item Details');
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
