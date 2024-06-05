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
const Category_1 = __importDefault(require("../models/Category"));
const Item_1 = __importDefault(require("../models/Item"));
const express_validator_1 = require("express-validator");
const EnvVars_1 = __importDefault(require("@src/constants/EnvVars"));
const CategoryController = (() => {
    const index = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const categories = yield Category_1.default.find().exec();
        res.render('categories/index', { title: "Categories", categories: categories });
    });
    const show = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const [category, items] = yield Promise.all([
            Category_1.default.findById(req.params.id).exec(),
            Item_1.default.find({ category: req.params.id }).exec()
        ]);
        if (!category) {
            res.status(404).send('Category not found');
            return;
        }
        res.render('categories/show', { title: category.name, category: category, items: items });
    });
    const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        res.render('categories/form', { title: 'Create Category' });
    });
    const update = [
        (0, express_validator_1.body)('name', 'Name must have at least 3 characters')
            .trim()
            .isLength({ min: 3 })
            .escape(),
        (0, express_validator_1.body)('description', 'Description must have at least 3 characters')
            .trim()
            .isLength({ min: 3 })
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
            const category = new Category_1.default({
                name: req.body.name,
                description: req.body.description,
                _id: req.params.id
            });
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                res.render('categories/form', {
                    title: 'Edit Category',
                    category: category,
                    secure: true,
                    errors: errors.array()
                });
                return;
            }
            else {
                try {
                    yield Category_1.default.findByIdAndUpdate(req.params.id, category).exec();
                    res.redirect(category.url);
                }
                catch (err) {
                    next(err);
                }
            }
        })
    ];
    const destroy_get = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const [category, items] = yield Promise.all([
            Category_1.default.findById(req.params.id).exec(),
            Item_1.default.find({ category: req.params.id }).exec()
        ]);
        if (!category) {
            res.status(404).send('Category not found');
            return;
        }
        res.render('categories/delete', { title: 'Delete Category', category: category, items: items });
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
            const [category, items] = yield Promise.all([
                Category_1.default.findById(req.params.id).exec(),
                Item_1.default.find({ category: req.params.id }).exec(),
            ]);
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                res.render('categories/delete', { title: 'Delete Category', category: category, items: items, errors: errors.array() });
            }
            if (items.length > 0) {
                res.render("categories.delete", {
                    title: "Delete Category",
                    category: category,
                    items: items,
                });
                return;
            }
            else {
                try {
                    yield Category_1.default.findByIdAndDelete(req.body.id).exec();
                    res.redirect("/categories");
                }
                catch (err) {
                    next(err);
                }
            }
        })
    ];
    const store = [
        (0, express_validator_1.body)('name', 'Name must have at least 3 characters')
            .trim()
            .isLength({ min: 3 })
            .escape(),
        (0, express_validator_1.body)('description', 'Description must have at least 3 characters')
            .trim()
            .isLength({ min: 3 })
            .escape(),
        (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            const category = new Category_1.default({
                name: req.body.name,
                description: req.body.description
            });
            if (!errors.isEmpty()) {
                res.render('categories/form', {
                    title: 'Create Category',
                    category: category,
                    errors: errors.array()
                });
                return;
            }
            else {
                try {
                    yield category.save();
                    res.redirect(category.url);
                }
                catch (err) {
                    next(err);
                }
            }
        })
    ];
    const edit = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const category = yield Category_1.default.findById(req.params.id).exec();
        if (!category) {
            res.status(404).send('Category not found');
            return;
        }
        res.render('categories/form', { title: 'Edit Category', category: category, secure: true });
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
exports.default = CategoryController;
