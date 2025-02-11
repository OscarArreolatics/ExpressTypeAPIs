import { Router } from "express";
import { tagControllers } from "../controllers/tagsController";
import { authMiddleware, authRoles } from "../middleware/auth";

const router = Router();

// create tag
router.post("/", authMiddleware, tagControllers.addTag);

// get all tags
router.get("/", tagControllers.getTags);

// get tag
router.get("/:id", tagControllers.getATag);

// update tag
router.put("/:id", authMiddleware, tagControllers.updateTag);

//delete tag
router.delete("/:id", authMiddleware, authRoles("admin", "editor"), tagControllers.deleteTag);

export default router;