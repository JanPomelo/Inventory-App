"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesRouter = void 0;
const express_1 = __importDefault(require("express"));
const CategoryController_1 = __importDefault(require("../controllers/CategoryController"));
const router = express_1.default.Router();
exports.CategoriesRouter = router;
router.get('/', CategoryController_1.default.index);
router.get('/create', CategoryController_1.default.create);
router.post('/create', CategoryController_1.default.store);
router.get('/:id', CategoryController_1.default.show);
router.get('/:id/edit', CategoryController_1.default.edit);
router.post('/:id/edit', CategoryController_1.default.update);
router.get('/:id/delete', CategoryController_1.default.destroy_get);
router.post('/:id/delete', CategoryController_1.default.destroy_post);
