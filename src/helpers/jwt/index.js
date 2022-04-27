"use strict";

// IMPORTS ==================================================================================================
const jwt = require("jsonwebtoken");
const { jwtConfig } = require("../../../config");

/**
 * Decode user api token
 * @param {string} token
 * @returns
 */
const decodeToken = (token) => {
	try {
		const decodedToken = jwt.verify(token, jwtConfig.jwtSecret);
		return decodedToken;
	} catch (error) {
		throw error;
	}
};

/**
 * Generate user api token
 * @param {number} empid
 * @returns
 */
const generateToken = (empid) => {
	try {
		const token = jwt.sign({ empid }, jwtConfig.jwtSecret, {
			expiresIn: jwtConfig.expiresIn,
		});
		return token;
	} catch (error) {
		throw error;
	}
};

module.exports = {
	decodeToken,
	generateToken,
};
