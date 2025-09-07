import { join } from 'path'

export default () => {
	return {
		type: 'mysql',
		host: process.env.DB_HOST || 'localhost',
		port: parseInt(process.env.DB_PORT) || 3307,
		username: process.env.DB_USERNAME || 'root',
		password: process.env.DB_PASSWORD || '',
		database: process.env.DB_DATABASE || 'boss_admin',
		entities: [join(__dirname, '../', '**/**.entity{.ts,.js}')],
		synchronize: process.env.NODE_ENV !== 'production',
		logging: process.env.NODE_ENV === 'development',
		retryAttempts: 3,
		retryDelay: 3000,
		autoLoadEntities: true,
		timeout: 60000,
		acquireTimeout: 60000,
		extra: {
			connectionLimit: 10
		}
	}
}
