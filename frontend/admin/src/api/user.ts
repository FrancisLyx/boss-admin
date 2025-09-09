import { request } from '@/lib/request'

interface LoginAuthDto {
	email: string
	password: string
}

export const login = (data: LoginAuthDto) => {
	return request('/auth/login', {
		method: 'POST',
		body: data
	})
}
