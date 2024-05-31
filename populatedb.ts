#! /usr/bin/env node

console.log(
  'This script populates some test items and categories to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

import Item from './src/models/Item';
import Category from './src/models/Category';
import IItem from './src/interfaces/Item';
import ICategory from './src/interfaces/Category';

const items: IItem[] = [];
const categories: ICategory[] = [];

import mongoose from 'mongoose';
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createCategories();
  await createItems();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// genre[0] will always be the Fantasy genre, regardless of the order
// in which the elements of promise.all's argument complete.
async function categoryCreate(index, name, description, slug) {
  const category = new Category({
    name: name,
    description: description,
    slug: slug,
  });
  categories[index] = category;
  await category.save();
  console.log(`Added category: ${name}`);
}

async function itemCreate(index, name, description, price, number_in_stock, category) {
  const item = new Item({
    name: name,
    description: description,
    price: price,
    number_in_stock: number_in_stock,
    category: category,
  });
  items[index] = item;
  await item.save();
  console.log(`Added item: ${name}`);
}

async function createCategories() {
  console.log("Adding categories");
  await Promise.all([
    categoryCreate(0, "Keyboards", "Mechanical keyboards - ready to use!", "keyboards"),
    categoryCreate(1, "Keycaps", "Keycaps for your mechanical keyboard", "keycaps"),
    categoryCreate(2, "Switches", "Switches for your mechanical keyboard", "switches"),
  ]);
}

async function createItems() {
  console.log("Adding items");
  await Promise.all([
    itemCreate(0, "Ducky One 2 Mini", "60% mechanical keyboard", 100, 10, categories[0]),
    itemCreate(1, "GMK Laser", "Keycap set", 50, 20, categories[1]),
    itemCreate(2, "Cherry MX Red", "Linear switch", 2, 100, categories[2]),
  ]);
}
