import knex from 'knex';

const UsersDbConnector = knex({
    client: 'mysql2',
    connection: {
        host : process.env.UsersDbConnector_host,
        port : process.env.UsersDbConnector_port,
        user : process.env.UsersDbConnector_user,
        password : process.env.UsersDbConnector_password,
        database : process.env.UsersDbConnector_database
    }
});

const getPwd = async function(email) {
    return UsersDbConnector.transaction(trx => {
        return UsersDbConnector.select('password').from('user').where('email', email).then();
    }).then(res => {
        return res[0] != null ? res[0].password : null;
    });
}

export {UsersDbConnector, getPwd};