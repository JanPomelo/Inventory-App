import mongoose, { Schema } from 'mongoose';
import IItem from '../interfaces/Item';

const ItemSchema: Schema = new Schema<IItem>({
  name: { type: String, required: true, minlength: 3, maxlength: 100 },
  description: { type: String, required: true, minlength: 3, maxlength: 500 },
  price: { type: Number, required: true, min: 0 },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  number_in_stock: { type: Number, required: true, min: 0 },
  img: { type: String },
});

ItemSchema.virtual('url').get(function() {
  return `/items/${this._id}`;
});

const Item = mongoose.model<IItem>('Item', ItemSchema);

export default Item;
