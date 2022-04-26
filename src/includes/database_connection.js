"use strict";

// IMPORTS ==================================================================================================
const { Pool } = require("pg");
const { databaseConfig } = require("../../config");

// Connection
const pool = new Pool({
	host: databaseConfig.host,
	port: databaseConfig.port,
	user: databaseConfig.user,
	password: databaseConfig.password,
	database: databaseConfig.database,
});

class Connection {
	async connect() {
		this.client = await pool.connect();
	}

	release() {
		this.client.release();
	}

	async begin() {
		await this.client.query("BEGIN");
	}

	async commit() {
		await this.client.query("COMMIT");
	}

	async rollback() {
		await this.client.query("ROLLBACK");
	}

	async execute(query) {
		return this.client.query(query);
	}
}


module.exports = Connection;
