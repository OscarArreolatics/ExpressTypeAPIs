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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userServices = exports.userService = void 0;
const user_1 = __importDefault(require("../models/user"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET || "";
class userService {
    createUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, password } = data;
                const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
                const newUser = yield user_1.default.create({
                    name,
                    email,
                    password: hashedPassword,
                });
                return newUser;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    loginUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = data;
                const user = yield user_1.default.findOne({ email }).select('name email password ');
                if (!user) {
                    return "User not found";
                }
                const PassValid = yield bcryptjs_1.default.compare(password, user.password);
                if (!PassValid) {
                    return "Invalid credentials";
                }
                const UserOb = user.toObject();
                const { password: _, _id } = UserOb, UserRes = __rest(UserOb, ["password", "_id"]);
                const token = jsonwebtoken_1.default.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
                return { token: token, user: UserRes };
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.userService = userService;
exports.userServices = new userService();
