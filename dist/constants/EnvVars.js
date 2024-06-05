"use strict";
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    NodeEnv: ((_a = process.env.NODE_ENV) !== null && _a !== void 0 ? _a : ''),
    Port: ((_b = process.env.PORT) !== null && _b !== void 0 ? _b : 0),
    MongoUri: ((_c = process.env.MONGO_DB_URI) !== null && _c !== void 0 ? _c : ''),
    Cloudinary: {
        AppName: ((_d = process.env.CLOUDINARY_APP_NAME) !== null && _d !== void 0 ? _d : ''),
        ApiKey: ((_e = process.env.CLOUDINARY_API_KEY) !== null && _e !== void 0 ? _e : ''),
        ApiSecret: ((_f = process.env.CLOUDINARY_API_SECRET) !== null && _f !== void 0 ? _f : ''),
    },
    AdminPassword: ((_g = process.env.ADMIN_PW) !== null && _g !== void 0 ? _g : ''),
    CookieProps: {
        Key: 'ExpressGeneratorTs',
        Secret: ((_h = process.env.COOKIE_SECRET) !== null && _h !== void 0 ? _h : ''),
        Options: {
            httpOnly: true,
            signed: true,
            path: ((_j = process.env.COOKIE_PATH) !== null && _j !== void 0 ? _j : ''),
            maxAge: Number((_k = process.env.COOKIE_EXP) !== null && _k !== void 0 ? _k : 0),
            domain: ((_l = process.env.COOKIE_DOMAIN) !== null && _l !== void 0 ? _l : ''),
            secure: (process.env.SECURE_COOKIE === 'true'),
        },
    },
    Jwt: {
        Secret: ((_m = process.env.JWT_SECRET) !== null && _m !== void 0 ? _m : ''),
        Exp: ((_o = process.env.COOKIE_EXP) !== null && _o !== void 0 ? _o : ''),
    },
};
