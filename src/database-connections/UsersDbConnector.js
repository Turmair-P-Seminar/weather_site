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

export {UsersDbConnector};