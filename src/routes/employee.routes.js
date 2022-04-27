"use strict";

const { Router } = require("express");
const { employeeController } = require("../controllers");
const authentication = require("../middelware/authentication.middleware");

const router = new Router();

router.post("/register", employeeController.register);
router.post("/login", employeeController.login);

router.get("/logout", authentication, employeeController.logout);

module.exports = router;
