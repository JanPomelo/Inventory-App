"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemsRouter = void 0;
const express_1 = __importDefault(require("express"));
const ItemController_1 = __importDefault(require("../controllers/ItemController"));
const router = express_1.default.Router();
exports.ItemsRouter = router;
router.get('/', ItemController_1.default.index);
router.get('/create', ItemController_1.default.create);
router.post('/create', ItemController_1.default.store);
router.get('/:id', ItemController_1.default.show);
router.get('/:id/edit', ItemController_1.default.edit);
router.post('/:id/edit', ItemController_1.default.update);
router.get('/:id/delete', ItemController_1.default.destroy_get);
router.post('/:id/delete', ItemController_1.default.destroy_post);
