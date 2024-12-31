import { Router} from "express";
import { userControllers } from "../controllers/userController";

const router = Router();

// create user
router.post("/register", userControllers.addUser);

export default router;