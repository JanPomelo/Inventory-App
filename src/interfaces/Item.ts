import ICategory from './Category';

interface IItem {
  name: string;
  description: string;
  price: number;
  number_in_stock: number;
  url: string;
  category: ICategory;
  img?: string;
}

export default IItem;
