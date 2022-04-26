"use strict";

const { Router } = require("express");
const { employeeController } = require("../controllers");

const router = new Router();

router.post("/register", employeeController.register);

module.exports = router;
