// import { Module } from '@nestjs/common'
// import { AppController } from './app.controller'
// import { AppService } from './app.service'
// import { ConfigModule, ConfigService } from '@nestjs/config'
// import { TypeOrmModule } from '@nestjs/typeorm'
// import getDatabaseConfig from './config/database'

// @Module({
// 	imports: [
// 		ConfigModule.forRoot({ isGlobal: true, load: [getDatabaseConfig], envFilePath: '.env' }),
// 		TypeOrmModule.forRootAsync({
// 			imports: [ConfigModule],
// 			useFactory: (config: ConfigService) => {
// 				return config.get('database')
// 			},
// 			inject: [ConfigService]
// 		})
// 	],
// 	controllers: [AppController],
// 	providers: [AppService]
// })
// export class AppModule {}

import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { join } from 'path'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: '.env'
		}),
		TypeOrmModule.forRoot({
			type: 'mysql',
			host: process.env.DB_HOST || 'localhost',
			port: parseInt(process.env.DB_PORT) || 3306,
			username: process.env.DB_USERNAME || 'root',
			password: process.env.DB_PASSWORD || 'boss_admin',
			database: process.env.DB_DATABASE || 'boss_admin',
			entities: [join(__dirname, '**', '*.entity{.ts,.js}')],
			synchronize: process.env.NODE_ENV !== 'production',
			logging: process.env.NODE_ENV === 'development',
			retryAttempts: 3,
			retryDelay: 3000,
			autoLoadEntities: true
		})
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
