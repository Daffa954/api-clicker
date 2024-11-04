import { Router } from "express";
import {
  clickTheButton,
  createUser,
  gachaClickPower,
  getAllUsers,
  login,
  findUser,
  upgradeClicker,
  gachaPoints,
  unlockAutoClicker,
  autoClick,
  updateUser,
  deleteUser,
  upload,
} from "../controllers/userController";

const router = Router();

router.get("/", getAllUsers);
router.post("/create", createUser);
router.post("/login", login);
router.put("/click", clickTheButton);
router.put("/upgradeClick", upgradeClicker);
router.put("/gachaClick", gachaClickPower);
router.put("/gachaPoints", gachaPoints);
router.put("/autoclickunlock", unlockAutoClicker);
router.put("/autoclick", autoClick);
router.post("/finduser", findUser);
router.put("/update", upload.single("profileImage"), updateUser);
router.delete("/delete", deleteUser);
export default router;
