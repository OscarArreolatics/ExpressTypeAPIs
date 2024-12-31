"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const router = (0, express_1.Router)();
// create user
router.post("/register", userController_1.userControllers.addUser);
// login user
router.post("/login", userController_1.userControllers.login);
exports.default = router;
