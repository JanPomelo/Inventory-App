"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Item_1 = __importDefault(require("../models/Item"));
const Category_1 = __importDefault(require("../models/Category"));
const express_validator_1 = require("express-validator");
const EnvVars_1 = __importDefault(require("../constants/EnvVars"));
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.diskStorage({
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = (0, multer_1.default)({ storage: storage });
const cloudinary_1 = __importDefault(require("cloudinary"));
cloudinary_1.default.v2.config({
    cloud_name: EnvVars_1.default.Cloudinary.AppName,
    api_key: EnvVars_1.default.Cloudinary.ApiKey,
    api_secret: EnvVars_1.default.Cloudinary.ApiSecret
});
const ItemController = (() => {
    const index = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const items = yield Item_1.default.find().exec();
        res.render('items/index', { title: "Items", items: items });
    });
    const show = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const item = yield Item_1.default.findById(req.params.id).populate('category').exec();
        if (!item) {
            res.status(404).send('Item not found');
            return;
        }
        res.render('items/show', { title: item.name, item: item });
    });
    const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const categories = yield Category_1.default.find().sort({ "name": 1 }).exec();
        res.render('items/form', { title: 'Create Item', categories: categories });
    });
    const update = [
        upload.single('img'),
        (0, express_validator_1.body)('name', 'Name is required')
            .trim()
            .isLength({ min: 3 }).withMessage('Name must have at least 3 characters')
            .escape(),
        (0, express_validator_1.body)('description', 'Description is required')
            .trim()
            .isLength({ min: 3 }).withMessage('Description must have at least 3 characters')
            .escape(),
        (0, express_validator_1.body)('price', 'Price is required')
            .isFloat({ min: 0 }).withMessage('Price must be a positive number')
            .escape(),
        (0, express_validator_1.body)('number_in_stock', 'Number in stock is required')
            .isInt({ min: 0 }).withMessage('Number in stock must be a positive integer')
            .escape(),
        (0, express_validator_1.body)('category', 'Category is required')
            .isLength({ min: 1 })
            .escape(),
        (0, express_validator_1.body)('admin_pw', 'Admin Password Required')
            .escape()
            .trim()
            .custom((value, { req }) => {
            if (value === EnvVars_1.default.AdminPassword) {
                return true;
            }
            else {
                return false;
            }
        }).withMessage('Wrong Admin Password'),
        (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
            const item = new Item_1.default({
                name: req.body.name,
                description: req.body.description,
                price: req.body.price,
                number_in_stock: req.body.number_in_stock,
                category: req.body.category,
                _id: req.params.id,
                img: req.file ? req.file.filename : undefined
            });
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                const categories = yield Category_1.default.find().sort({ "name": 1 }).exec();
                res.render('items/form', {
                    title: 'Edit Item',
                    item: item,
                    categories: categories,
                    secure: true,
                    errors: errors.array()
                });
                return;
            }
            else {
                try {
                    if (req.file) {
                        const oldItem = yield Item_1.default.findById(req.params.id).exec();
                        const result = yield cloudinary_1.default.v2.uploader.upload(req.file.path);
                        item.img = result.secure_url;
                        if (oldItem.img) {
                            yield cloudinary_1.default.v2.uploader.destroy(oldItem.img.substring(oldItem.img.lastIndexOf('/') + 1, oldItem.img.lastIndexOf('.')));
                        }
                        yield Item_1.default.findByIdAndUpdate(req.params.id, item).exec();
                        res.redirect('/items');
                    }
                    else {
                        yield Item_1.default.findByIdAndUpdate(req.params.id, { name: item.name,
                            description: item.description,
                            price: item.price,
                            number_in_stock: item.number_in_stock,
                            category: item.category,
                            _id: item._id,
                        }).exec();
                        res.redirect('/items');
                    }
                }
                catch (err) {
                    console.error('Error creating item:', err);
                    const categories = yield Category_1.default.find().sort({ "name": 1 }).exec();
                    res.render('items/form', {
                        title: 'Create Item',
                        item: item,
                        categories: categories,
                        errors: [{ msg: 'An error occurred while creating the item' }]
                    });
                }
            }
        })
    ];
    const destroy_get = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const item = yield Item_1.default.findById(req.params.id).exec();
        if (!item) {
            res.status(404).send('Item not found');
            return;
        }
        res.render('items/delete', { title: 'Delete Item', item: item });
    });
    const destroy_post = [
        (0, express_validator_1.body)('admin_pw', 'Admin Password Required')
            .escape()
            .trim()
            .custom((value, { req }) => {
            if (value === EnvVars_1.default.AdminPassword) {
                return true;
            }
            else {
                return false;
            }
        }).withMessage('Wrong Admin Password'),
        (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                const item = yield Item_1.default.findById(req.params.id).exec();
                res.render('items/delete', { title: 'Delete Item', item: item, errors: errors.array() });
            }
            else {
                try {
                    yield cloudinary_1.default.v2.uploader.destroy(req.body.img_id);
                    yield Item_1.default.findByIdAndDelete(req.body.id).exec();
                    res.redirect('/items');
                }
                catch (err) {
                    next(err);
                }
            }
        })
    ];
    const store = [
        upload.single('img'),
        (0, express_validator_1.body)('name', 'Name is required')
            .trim()
            .isLength({ min: 3 }).withMessage('Name must have at least 3 characters')
            .escape(),
        (0, express_validator_1.body)('description', 'Description is required')
            .trim()
            .isLength({ min: 3 }).withMessage('Description must have at least 3 characters')
            .escape(),
        (0, express_validator_1.body)('price', 'Price is required')
            .isFloat({ min: 0 }).withMessage('Price must be a positive number')
            .escape(),
        (0, express_validator_1.body)('number_in_stock', 'Number in stock is required')
            .isInt({ min: 0 }).withMessage('Number in stock must be a positive integer')
            .escape(),
        (0, express_validator_1.body)('category', 'Category is required')
            .isLength({ min: 1 })
            .escape(),
        (0, express_validator_1.body)('img', 'Image is required')
            .custom((value, { req }) => {
            if (!req.file) {
                return false;
            }
            return true;
        }),
        (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
            const item = new Item_1.default({
                name: req.body.name,
                description: req.body.description,
                price: req.body.price,
                number_in_stock: req.body.number_in_stock,
                category: req.body.category,
                img: req.file ? req.file.filename : undefined
            });
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                const categories = yield Category_1.default.find().sort({ "name": 1 }).exec();
                res.render('items/form', {
                    title: 'Create Item',
                    item: item,
                    categories: categories,
                    errors: errors.array()
                });
                return;
            }
            else {
                try {
                    if (req.file) {
                        const result = yield cloudinary_1.default.v2.uploader.upload(req.file.path);
                        item.img = result.secure_url;
                        console.log(item.img);
                    }
                    yield item.save();
                    res.redirect('/items');
                }
                catch (err) {
                    console.error('Error creating item:', err);
                    const categories = yield Category_1.default.find().sort({ "name": 1 }).exec();
                    res.render('items/form', {
                        title: 'Create Item',
                        item: item,
                        categories: categories,
                        errors: [{ msg: 'An error occurred while creating the item' }]
                    });
                }
            }
        })
    ];
    const edit = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const [item, categories] = yield Promise.all([
            Item_1.default.findById(req.params.id).exec(),
            Category_1.default.find().sort({ "name": 1 }).exec()
        ]);
        if (!item) {
            res.status(404).send('Item not found');
            return;
        }
        res.render('items/form', { title: 'Edit Item', item: item, categories: categories, secure: true });
    });
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
exports.default = ItemController;
