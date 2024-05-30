# Inventory App

This is a simple inventory application build during the course of The Odin Project. The application is built using
Express.js + Typescript + MongoDB and pug as the view engine.

## Features

- Browse all categories
- Add a new category
- Edit an existing category
- Delete a category
- View all items in a category
- Add a new item to a category
- Edit an existing items
- Delete an item

## Installation

1. Clone the repository
2. Run `npm install`
3. Create a `.env` file in the root directory and add the following environment variables (see .env.example):
   - `MONGO_URI`: MongoDB connection string
   - `PORT`: Port number for the server
4. Run `npm run dev` to start the server

## License
- MIT

## Technical Details

### Database Structure

```
erDiagram

CATEGORY {
    Integer id pk
    String name
    String description
    String slug
    String url "virtual"
}

ITEM {
    Integer id pk
    Category category
    String name
    String description
    Double price
    Integer number_in_stock
    String url "virtual"

}

CATEGORY ||--o{ ITEM : "has"
```


