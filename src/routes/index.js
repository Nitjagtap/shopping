"use strict";

// Imports =============================

const { Router } = require("express");
const routes = {
    employeeRoutes: require("./employee.routes"),
};

const router = new Router();
 
// API MIDDEL POINTS =======================

router.use("/employee", routes.employeeRoutes);

// exports =========================================

module.exports = router;
