const oracledb = require('oracledb')

db = {
	user: 'ADMIN',
	password: '123',
	connectString: 'localhost:1521/orcl'
}

const open = async (query, peticion, autoCommit) => {
	const con = await oracledb.getConnection(db)
	const result = await con.execute(query, peticion, {
		autoCommit
	})

	con.release()

	return result
}

exports.Open = open