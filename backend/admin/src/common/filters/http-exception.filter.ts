import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
	catch(exception: unknown, host: ArgumentsHost) {
		const ctx = host.switchToHttp()
		const response = ctx.getResponse<any>()

		let status = HttpStatus.INTERNAL_SERVER_ERROR
		let message: any = 'Internal Server Error'
		let error: any = undefined

		if (exception instanceof HttpException) {
			status = exception.getStatus()
			const res = exception.getResponse() as any
			if (typeof res === 'string') {
				message = res
			} else if (res && typeof res === 'object') {
				message = res.message ?? exception.message
				error = res.error
			} else {
				message = exception.message
			}
		} else if (exception instanceof Error) {
			message = exception.message
		}

		response.status(status).json({
			code: status,
			message
		})
	}
}
