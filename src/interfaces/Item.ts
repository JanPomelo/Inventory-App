import ICategory from "./Category";

export default interface IItem {
  name: string;
  description: string;
  price: number;
  number_in_stock: number;
  url: string;
  category: ICategory;
}
