const express = require('express');
const userControllers = require('../controllers/userControllers');
const authController = require('../controllers/authController');

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

router.use(authController.protect);
//Now all below routes will need to be authenticated (loged in)

router.patch("/updateMyPassword",
    authController.updatePassword
);

router.get("/me",
    userControllers.getMe,
    userControllers.getUser
);
router.patch("/updateMe",
    userControllers.uploadUserPhoto,
    userControllers.resizeUserPhoto,
    userControllers.updateMe
);
router.delete("/deleteMe",
    userControllers.deleteMe
);

router.use(authController.restrictTo('admin'));

router.route("/")
    .get(userControllers.getAllUsers)
    .post(userControllers.createUser);

router.route("/:id")
    .get(userControllers.getUser)
    .patch(userControllers.updateUser)
    .delete(userControllers.deleteUser);

module.exports = router;

