"use strict";

// Imports =================

const { EMPLOYEES } = require("../constants/tables.constants");

const {
    ER_DATA_ALREADY_EXISTS,
    ER_FIELD_LENGTH,
    ER_DATA_NOT_FOUND,
    ER_USER_BLOCKED,
    ER
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
        console.log(find)
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
// EXPORTS ==================================================================================================
module.exports = {
    register,
};
