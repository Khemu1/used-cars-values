import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Reports } from './reports/reports.entity';
console.log('SQLite config sanity check:', {
  cwd: process.cwd(),
  dbPath: 'db.sqlite',
  envDB: process.env.DB_PATH,
  envDATABASE_URL: process.env.DATABASE_URL,
});
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [User, Reports],
      synchronize: true, // auto updates the database schema , (REMOVE IT IN PRODUCTION)
    }),

    UsersModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
