import knex from 'knex';

const PublicDataDbConnector = knex({
    client: 'mysql2',
    connection: {
        host : process.env.PublicDataDbConnector_host,
        port : process.env.PublicDataDbConnector_port,
        user : process.env.PublicDataDbConnector_user,
        password : process.env.PublicDataDbConnector_password,
        database : process.env.PublicDataDbConnector_database
    },
    debug: true
});

export {PublicDataDbConnector};