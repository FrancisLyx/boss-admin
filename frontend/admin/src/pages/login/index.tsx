import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/store/auth'
import { login } from '@/api/user'

function Login() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const nav = useNavigate()
	const { setToken } = useAuth()

	const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setLoading(true)
		setError('') // 清除之前的错误信息

		try {
			// 调用登录API
			const res = await login({ email, password })
			console.log('登录成功:', res)

			// 登录成功后设置token并跳转
			if (res.access_token) {
				setToken(res.access_token)
				nav('/', { replace: true })
			}
		} catch (error: any) {
			console.error('登录失败:', error)
			// 显示错误信息
			setError(error?.message || '登录失败，请检查邮箱和密码')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className='min-h-dvh grid place-items-center p-4'>
			<Card className='w-full max-w-[360px]'>
				<CardHeader>
					<CardTitle>登录</CardTitle>
				</CardHeader>
				<CardContent>
					<form className='space-y-4' onSubmit={onSubmit}>
						{error && (
							<div className='p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md'>
								{error}
							</div>
						)}

						<div className='space-y-2'>
							<Label htmlFor='email'>邮箱</Label>
							<Input
								id='email'
								type='email'
								placeholder='you@example.com'
								required
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>
						<div className='space-y-2'>
							<Label htmlFor='password'>密码</Label>
							<Input
								id='password'
								type='password'
								placeholder='请输入密码'
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>
						<Button className='w-full' type='submit' disabled={loading}>
							{loading ? '登录中...' : '登录'}
						</Button>

						<div className='text-center text-sm text-muted-foreground'>
							没有账户？{' '}
							<button
								type='button'
								onClick={() => nav('/register')}
								className='text-primary hover:underline'>
								立即注册
							</button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	)
}

export default Login
