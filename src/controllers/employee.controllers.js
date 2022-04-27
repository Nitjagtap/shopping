"use strict";

// Imports ==================================

const {employeeService} = require("../services");
const Connection = require("../includes/database_connection");

// controller

/**
 * register employee controller
 * @param {object} req
 * @param {object} res
 * @param {object} next
 */

const register = async (req , res , next)=>{
    const con = new Connection();
    await con.connect();
    await con.begin();

    try {
        // validations

        if (!req.body.emp_name) throw ER_FIELD_EMPTY("emp_name");
        if (!req.body.emp_email) throw ER_FIELD_EMPTY("emp_email");
        if (!req.body.emp_mobile) throw ER_FIELD_EMPTY("emp_mobile");
        if (!req.body.emp_national_id) throw ER_FIELD_EMPTY("emp_national_id");
		if (!req.body.password) throw ER_FIELD_EMPTY("password");
        
        const response = await employeeService.register(con , req.body);
        console.log(response);
        await con.commit();
        con.release();
        res.send(response);

    } catch (error) {
        await con.rollback();
        con.release();
        next(error);        
    }
};

/**
 * Login employee - controller
 * @param {object} req
 * @param {object} res
 * @param {object} next
 */
const login = async (req, res, next) => {
	const con = new Connection();
	await con.connect();
	await con.begin();

	try {
		// Validations
		if (!req.body.emp_email) throw ER_FIELD_EMPTY("emp_email");
		if (!req.body.password) throw ER_FIELD_EMPTY("password");

		const response = await employeeService.login(con, req.body);

		await con.commit();
		con.release();

		res.send(response);
	} catch (error) {
		await con.rollback();
		con.release();

		next(error);
	}
};

/**
 * Logout employee - controller
 * @param {object} req
 * @param {object} res
 * @param {object} next
 */
 const logout = async (req, res, next) => {
	const con = req._con;
	await con.begin();

	try {
		const response = await employeeService.logout(con, req._empid);

		await con.commit();
		con.release();

		res.send(response);
	} catch (error) {
		await con.rollback();
		con.release();

		next(error);
	}
};
module.exports = {
    register,
    login,
    logout
};
