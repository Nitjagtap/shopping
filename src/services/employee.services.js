"use strict";

// Imports =================

const { EMPLOYEES } = require("../constants/tables.constants");
const { generateToken } = require("../helpers/jwt");

const {
    ER_DATA_ALREADY_EXISTS,
    ER_FIELD_LENGTH,
    ER_DATA_NOT_FOUND,
    ER_USER_BLOCKED
} = require("../constants/errors.constants");
const res = require("express/lib/response");

// SERVICES

/**
 * register employee service
 * @param {object} con
 * @param {object} body
 * @returns
 */

const register = async (con, body) => {
    const response = {
        message: "Employee Registerd.",
    };

    const { emp_name, emp_email, emp_mobile, emp_national_id, password } = body;
    if (password.length >= 6) {
        const find = await con.execute(
            `SELECT empid FROM ${EMPLOYEES} WHERE emp_email = '${emp_email}'`
        );
        if (find.rowCount > 0) {
            throw ER_DATA_ALREADY_EXISTS("emp_email");
        } else {
            // Insert operation
            const data =
                await con.execute(`INSERT INTO ${EMPLOYEES}(emp_name,emp_email,emp_mobile,emp_national_id,password) 
                VALUES ('${emp_name}','${emp_email}','${emp_mobile}','${emp_national_id}','${password}')
		        RETURNING  emp_name, emp_email, emp_mobile, emp_national_id`);
            response.data = data.rows || data;

            return response;
        }
    }else{
        throw ER_FIELD_LENGTH("password");
    
    }
};


/**
 * login employee service
 * @param {object} con
 * @param {object} body
 * @returns
 */

const login = async(con,body)=>{
    const response = {
        message : "Employee LogIn."
    }
    const {emp_email,password} = body;

    let records = await con.execute(
		`SELECT empid, password, blocked FROM ${EMPLOYEES} WHERE emp_email='${emp_email}'`,
	);

	// if records are found then proceed
	if (records.rowCount > 0) {
		const record = records.rows[0];

		// Check if user is blocked
		if (record.blocked) throw ER_USER_BLOCKED;

		// Check password
		if (record.password !== password) {
			//**** ADD ENCRYPTION HERE LATER ON ****
			throw ER_DATA_NOT_FOUND("employee");
		}

		// Generate and update token.
		const token = generateToken(record.empid);
		response.data = (
			await con.execute(
				`UPDATE ${EMPLOYEES} 
				SET token='${token}' 
				WHERE empid=${record.empid} 
				RETURNING empid, emp_name, emp_email, emp_mobile, emp_national_id, token`,
			)
		).rows[0];

		return response;
	}

	// else error
	throw ER_DATA_NOT_FOUND("employee");
};

/**
 * Logout employee - service
 * @param {object} con
 * @param {string} empid
 * @returns
 */
 const logout = async (con, empid) => {
	const response = {
		message: "User successfully logged out.",
		data: {},
	};

	await con.execute(`UPDATE ${EMPLOYEES} SET token='' WHERE empid=${empid}`);
	return response;
};

// EXPORTS ==================================================================================================
module.exports = {
    register,
    login,
    logout

};
