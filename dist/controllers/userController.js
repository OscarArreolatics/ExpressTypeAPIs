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
exports.userControllers = void 0;
const user_1 = require("../models/user");
const user_2 = __importDefault(require("../models/user"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET || "";
class userController {
    constructor() {
        this.addUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { error } = user_1.UserSchemaVali.validate(req.body);
            if (error) {
                res.send(error.message);
                return;
            }
            try {
                const { name, email, password } = req.body;
                const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
                const newUser = yield user_2.default.create({
                    name,
                    email,
                    password: hashedPassword,
                });
                const UserOb = newUser.toObject();
                const { password: _, _id } = UserOb, UserRes = __rest(UserOb, ["password", "_id"]);
                res.status(201).send(UserRes);
            }
            catch (error) {
                console.log(error);
            }
        });
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { error } = user_1.LoginSchemaVali.validate(req.body);
            if (error) {
                res.send(error.message);
                return;
            }
            try {
                const { email, password } = req.body;
                const user = yield user_2.default.findOne({ email }).select("name email password ");
                if (!user) {
                    res.send("User not found");
                    return;
                }
                const PassValid = yield bcryptjs_1.default.compare(password, user.password);
                if (!PassValid) {
                    res.send("Invalid credentials");
                    return;
                }
                const UserOb = user.toObject();
                const { password: _, _id } = UserOb, UserRes = __rest(UserOb, ["password", "_id"]);
                const token = jsonwebtoken_1.default.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
                res.send({ token: token, user: UserRes });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.userControllers = new userController();
