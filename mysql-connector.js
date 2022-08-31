import knex from 'knex';

const Knex = knex({
    client: 'mysql2',
    connection: {
        host : 'mcnoip.ddns.net',
        port : 3306,
        user : 'knex',
        password : 'äÔë9²à¤yéøÌBçÑAsOã=¢',
        database : 'users'
    },
    debug: true
});


const changePwd = function(username, encodedPwd) {
    Knex.transaction(trx => {
        return Knex.raw(
            'call users.changePassword(?, ?);',
            [encodedPwd, username]
        ).then();
    }).then(res => console.log("Got output:", res));
}

const getPwd = async function(email) {
    return Knex.transaction(trx => {
        return Knex.select('password').from('user').where('email', email).then();
    }).then(res => {
        return res[0].password
    });
}

export {changePwd, getPwd, Knex};