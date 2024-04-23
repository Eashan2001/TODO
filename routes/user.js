import express from "express";
import { register } from "../controllers/user.js";
import { getUserDetails} from "../controllers/user.js";
import { login } from "../controllers/user.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { logout } from "../controllers/user.js";

const router =express.Router();



router.post("/new", register );

router.post("/login", login );

router.get("/logout", logout );

router.get("/me",isAuthenticated,getUserDetails)



// router.get("/userid/:id",getUserDetails)
// router.put("/userid/:id", updateUsers)
// router.delete("/userid/:id", deleteUsers)


export default router;