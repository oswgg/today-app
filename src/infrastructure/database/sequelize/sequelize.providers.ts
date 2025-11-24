import { Sequelize } from 'sequelize-typescript';
import {
    CategoryModel,
    EventCategoriesModel,
    EventModel,
    InstitutionProfileModel,
    LocationModel,
    OrganizerProfileModel,
    UserModel,
} from './models';
import { SEQUELIZE } from './constants';

export const databaseProviders = [
    {
        provide: SEQUELIZE,
        useFactory: async () => {
            const sequelize = new Sequelize(
                process.env.SUPABASE_URL as string,
                {
                    dialect: 'postgres',
                    logging:
                        process.env.NODE_ENV === 'development'
                            ? console.log
                            : false,
                    dialectOptions: {
                        ssl:
                            process.env.NODE_ENV === 'production'
                                ? {
                                      require: true,
                                      rejectUnauthorized: false,
                                  }
                                : false,
                    },
                },
            );

            sequelize.addModels([
                UserModel,
                CategoryModel,
                EventModel,
                LocationModel,
                OrganizerProfileModel,
                InstitutionProfileModel,
                EventCategoriesModel,
            ]);

            // Don't sync in production - use migrations instead
            if (process.env.NODE_ENV === 'development') {
                await sequelize.sync({ alter: false });
            }

            return sequelize;
        },
    },
];
