"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const taskRoutes_1 = __importDefault(require("../src/routes/taskRoutes"));
const userRoutes_1 = __importDefault(require("../src/routes/userRoutes"));
const DBconnect_1 = require("../src/connect/DBconnect");
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
//routes
app.use("/tasks", taskRoutes_1.default);
app.use("/auth", userRoutes_1.default);
app.get("/", (req, res) => {
    res.send("Hello, TypeScript Express!");
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something went wrong");
});
(0, DBconnect_1.conDB)().then(() => app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}));
