import { Global, Module } from '@nestjs/common';
import { databaseProviders } from './sequelize.providers';

@Global()
@Module({
    providers: [...databaseProviders],
    exports: [...databaseProviders],
})
export class SequelizeModule {}
