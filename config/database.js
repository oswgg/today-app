require('dotenv').config();

module.exports = {
    development: {
        url: process.env.SUPABASE_DIRECT_URL,
        dialect: 'postgres',
        dialectOptions: {
            ssl: false
        },
        logging: console.log,
        migrationStorage: 'sequelize',
        migrationStorageTableName: 'SequelizeMeta',
        seederStorage: 'sequelize',
        seederStorageTableName: 'SequelizeData'
    },
    production: {
        url: process.env.SUPABASE_DIRECT_URL,
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },
        logging: false,
        migrationStorage: 'sequelize',
        migrationStorageTableName: 'SequelizeMeta',
        seederStorage: 'sequelize',
        seederStorageTableName: 'SequelizeData'
    }
};
