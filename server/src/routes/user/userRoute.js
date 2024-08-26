const express = require("express");
const router = express.Router();
const userController = require("../../controller/user/userController");
const verifyToken = require("../../middleware/jwt-verification")


router.get("/users", userController.getAllUsers);
router.get("/users/:id", userController.getUserById);
router.post("/users", userController.createUser);
router.put("/users/:id", userController.updateUser);
router.delete("/users/:id", userController.deleteUser);
router.post("/login", userController.loginUser);
router.post("/checkemail", userController.checkEmailAvailability);
router.post("/checkusername", userController.checkUsernameAvailability);
router.post("/checkpassword", userController.checkPassword);
router.post("/checkpassworduniqueness", userController.checkPasswordUniqueness);
router.patch("/users/:id/password", userController.updatePassword);
router.get("/activate", userController.activateUser);
router.post("/forgot-password", userController.forgotPassword);
router.post("/change-password", userController.changePassword);

module.exports = router;