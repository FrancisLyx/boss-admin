import { SetMetadata } from '@nestjs/common'
import { SKIP_TRANSFORM } from '../interceptors/transform.interceptor'

export const SkipTransform = () => SetMetadata(SKIP_TRANSFORM, true)

