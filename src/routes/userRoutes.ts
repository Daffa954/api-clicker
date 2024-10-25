import { Router } from "express";
import { clickTheButton, createUser, gachaClickPower, getAllUsers, login, upgradeClicker } from "../controllers/userController";

//buat ada link dan method apa saja
const router = Router();

router.get("/", getAllUsers);
router.post("/create", createUser);
router.post("/login", login);
router.put("/click", clickTheButton);
router.put("/upgradeClick", upgradeClicker);
router.put("/gachaClick", gachaClickPower);

export default router;
