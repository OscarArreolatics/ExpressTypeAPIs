import { Router} from "express";
import { userControllers } from "../controllers/userController";

const router = Router();

// create user
router.post("/", userControllers.addUser);

// login user
router.post("/login", userControllers.login);

export default router;