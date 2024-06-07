import ICategory from '@src/interfaces/Category';
import { Request } from 'express';

interface UpdateItemRequest extends Request {
    body: {
      name: string;
      description: string;
      number_in_stock: number;
      price: number;
      category: ICategory;
    }
}

export default UpdateItemRequest;
