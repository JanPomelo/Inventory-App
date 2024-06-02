import mongoose, { Schema } from 'mongoose';
import ICategory from '../interfaces/Category';

const CategorySchema: Schema = new Schema<ICategory>({
  name: { type: String, required: true, minlength: 3, maxlength: 100},
  description: { type: String, required: true, minlength: 3, maxlength: 1000},
});

CategorySchema.virtual('url').get(function () {
  return '/categories/' + this._id;
});

const Category = mongoose.model<ICategory>('Category', CategorySchema);

export default Category;
