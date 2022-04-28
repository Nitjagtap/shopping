"use strict";

const { Router } = require("express");
const { employeeController } = require("../controllers");
const authentication = require("../middelware/authentication.middleware");

const router = new Router();

router.post("/register", employeeController.register);
router.post("/login", employeeController.login);
router.put("/update-password", employeeController.UpdatePassword);

router.get("/logout", authentication, employeeController.logout);
router.put("/update",authentication,employeeController.update);

module.exports = router;
