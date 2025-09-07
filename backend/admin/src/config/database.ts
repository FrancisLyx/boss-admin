import { registerAs } from '@nestjs/config'
import { join } from 'path'
export default registerAs('database', () => {
	const toBool = (v: string | undefined, def = false) => {
		if (v === undefined) return def
		return ['true', '1', 'on', 'yes'].includes(String(v).toLowerCase())
	}

	return {
		type: 'mysql',
		host: process.env.DB_HOST,
		port: process.env.DB_PORT,
		username: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_DATABASE,
		entities: [join(__dirname, '..', '**', '*.entity{.ts,.js}')],
		synchronize: toBool(process.env.DB_SYNCHRONIZE, process.env.NODE_ENV !== 'production'),
		logging: false,
		retryAttempts: 3,
		retryDelay: 3000,
		autoLoadEntities: true,
		connectTimeout: 60000,
		poolSize: 10
	}
})
