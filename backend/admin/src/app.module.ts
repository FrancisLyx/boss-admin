import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from './module/auth/auth.module'
import getDatabaseConfig from './config/database'

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true, load: [getDatabaseConfig], envFilePath: '.env' }),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (config: ConfigService) => {
				return config.get('database')
			},
			inject: [ConfigService]
		}),
		AuthModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
