import { Router} from "express";
import { authControllers } from "../controllers/authController";

const router = Router();

// login user
router.post("/login", authControllers.login);

// logout user
router.post("/logout", authControllers.logout);

// validate token
router.get("/check", authControllers.checkToken);

export default router;