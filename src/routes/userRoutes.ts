import { Router} from "express";
import { userControllers } from "../controllers/userController";
import { authMiddleware, authRoles  } from "../middleware/auth";

const router = Router();

// create user
router.post("/register", userControllers.addUser);

//get users 
router.get("/", authMiddleware, userControllers.getUsers)

export default router;