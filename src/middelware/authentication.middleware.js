"use strict";

// IMPORTS ==================================================================================================
const { ER_UNAUTHENTICATED_EMPLOYEE } = require("../constants/errors.constants");
const Connection = require("../includes/database_connection");
const { decodeToken } = require("../helpers/jwt");
const { EMPLOYEES } = require("../constants/tables.constants");
const logger = require("../helpers/logger");

// METHODS ==================================================================================================
/**
 * Authentication middleware function.
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns
 */
const authentication = async (req, res, next) => {
	try {
		console.log(req.headers)
		let token = req.headers.authorization.replace("Bearer ", "");
		const dToken = decodeToken(token);
		console.log(dToken)
		// If token is decoded then it will have id. Else it will throw error
		if (dToken.empid) {
			// Creating connection
			const con = new Connection();
			await con.connect();
			// Fetching user data
			const records = await con.execute(
				`SELECT empid FROM ${EMPLOYEES} WHERE token='${token}'`,
			);
			
			// Checking if user exists
			if (records.rowCount === 1) {
				req._empid = records.rows[0].empid;
				req._con = con;
				return next();
			}
			// Releasing connection
			con.release();
		}

		// If the code comes here then there is some issue in decoding token. Hence, user is not authenticated.
		throw ER_UNAUTHENTICATED_EMPLOYEE;
	} catch (error) {
		// If there is any error then user is not authenticated.
		logger.error(ER_UNAUTHENTICATED_EMPLOYEE.code);
		res.status(ER_UNAUTHENTICATED_EMPLOYEE.statusCode).send({
			errorCode: ER_UNAUTHENTICATED_EMPLOYEE.code,
			statusCode: ER_UNAUTHENTICATED_EMPLOYEE.statusCode,
			message: ER_UNAUTHENTICATED_EMPLOYEE.message,
			data: {},
		});
	}
};

// EXPORTS ==================================================================================================
module.exports = authentication;
