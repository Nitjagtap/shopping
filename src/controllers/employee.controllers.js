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

/**
 * Update user - controller
 * @param {object} req
 * @param {object} res
 * @param {object} next
 */
 const update = async (req, res, next) => {
	const con = req._con;
	await con.begin();

	try {
		const { emp_email, emp_name, emp_mobile, emp_national_id, blocked } = req.body;
		// Check if email is passed
		if (!emp_email) throw ER_FIELD_EMPTY("emp_email");
		// Check if at least one of the following set items is passed.
		if (!emp_name && !emp_mobile && !emp_national_id && !emp_email && !blocked)
			throw ER_MISSING_FIELDS("emp_name, emp_mobile, emp_email, emp_national_id, blocked");

		let response = await employeeService.update(con, req.body);

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
 * User Update Password - controller
 * @param {object} req
 * @param {object} res
 * @param {object} next
 */
 const UpdatePassword = async (req, res, next) => {
	const con = new Connection();
	await con.connect();
	await con.begin();

	try {
		const response = await employeeService.UpdatePassword(con, req.body);

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
    logout,
	update,
	UpdatePassword
};
