import { Router } from "express";
import { verifyJWT, isAdmin } from "../middlewares/auth.middleware.js";
import { 
    createTask, 
    getUserTasks, 
    updateTask, 
    deleteTask,
    adminGetAllTasks 
} from "../controllers/task.controller.js";

const router = Router();

router.use(verifyJWT); 

router.route("/").post(createTask).get(getUserTasks);
router.route("/:taskId").patch(updateTask).delete(deleteTask);

router.route("/admin/all").get(isAdmin, adminGetAllTasks);

export default router;