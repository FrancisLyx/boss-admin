import { NestFactory, Reflector } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { AllExceptionsFilter } from './common/filters/http-exception.filter'
import { TransformInterceptor } from './common/interceptors/transform.interceptor'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	// 设置全局API前缀
	app.setGlobalPrefix('api')

	// pipe 校验
	app.useGlobalPipes(
		new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })
	)
	// 全局过滤器，异常状态下处理
	app.useGlobalFilters(new AllExceptionsFilter())
	// 全局拦截器，请求处理
	const reflector = app.get(Reflector)
	app.useGlobalInterceptors(new TransformInterceptor(reflector))
	await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
