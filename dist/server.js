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
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const helmet_1 = __importDefault(require("helmet"));
const express_1 = __importDefault(require("express"));
const jet_logger_1 = __importDefault(require("jet-logger"));
const mongoose_1 = __importDefault(require("mongoose"));
const items_1 = require("@src/routes/items");
const categories_1 = require("@src/routes/categories");
const access_route_1 = __importDefault(require("@src/middleware/access-route"));
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = require("express-rate-limit");
require("express-async-errors");
const api_1 = __importDefault(require("@src/routes/api"));
const Paths_1 = __importDefault(require("@src/constants/Paths"));
const EnvVars_1 = __importDefault(require("@src/constants/EnvVars"));
const HttpStatusCodes_1 = __importDefault(require("@src/constants/HttpStatusCodes"));
const misc_1 = require("@src/constants/misc");
const classes_1 = require("@src/other/classes");
const app = (0, express_1.default)();
mongoose_1.default.set('strictQuery', false);
const mongoDB = EnvVars_1.default.MongoUri;
function connectToDB() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(mongoDB);
        }
        catch (err) {
            console.error(err);
        }
    });
}
connectToDB();
app.set('view engine', 'pug');
app.use(access_route_1.default);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)(EnvVars_1.default.CookieProps.Secret));
if (EnvVars_1.default.NodeEnv === misc_1.NodeEnvs.Dev.valueOf()) {
    app.use((0, morgan_1.default)('dev'));
}
if (EnvVars_1.default.NodeEnv === misc_1.NodeEnvs.Production.valueOf()) {
    app.use((0, compression_1.default)());
    app.use((0, helmet_1.default)());
    const limiter = (0, express_rate_limit_1.rateLimit)({
        windowMs: 1 * 60 * 1000,
        max: 20,
    });
    app.use(limiter);
}
app.use(Paths_1.default.Base, api_1.default);
app.get('/', (req, res, next) => {
    res.render('home');
});
app.use('/items', items_1.ItemsRouter);
app.use('/categories', categories_1.CategoriesRouter);
app.use((err, _, res, next) => {
    if (EnvVars_1.default.NodeEnv !== misc_1.NodeEnvs.Test.valueOf()) {
        jet_logger_1.default.err(err, true);
    }
    let status = HttpStatusCodes_1.default.BAD_REQUEST;
    if (err instanceof classes_1.RouteError) {
        status = err.status;
    }
    return res.status(status).json({ error: err.message });
});
const viewsDir = path_1.default.join(__dirname, 'views');
app.set('views', viewsDir);
const staticDir = path_1.default.join(__dirname, 'public');
app.use(express_1.default.static(staticDir));
exports.default = app;
