import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

export const SKIP_TRANSFORM = 'skipTransform'

@Injectable()
export class TransformInterceptor implements NestInterceptor {
	constructor(private readonly reflector: Reflector) {}

	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const skip = this.reflector.getAllAndOverride<boolean>(SKIP_TRANSFORM, [
			context.getHandler(),
			context.getClass()
		])
		if (skip) return next.handle()

		return next.handle().pipe(
			map((data) => ({
				code: 200,
				message: 'success',
				data
			}))
		)
	}
}
