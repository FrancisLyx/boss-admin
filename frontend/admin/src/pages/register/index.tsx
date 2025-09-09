import { FormEvent, useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/store/auth'

function Register() {
	const { setToken } = useAuth()
	const nav = useNavigate()
	const [loading, setLoading] = useState(false)

	const onSubmit = useCallback(
		async (e: FormEvent<HTMLFormElement>) => {
			e.preventDefault()
			setLoading(true)

			const formData = new FormData(e.currentTarget)
			const data = {
				name: formData.get('name') as string,
				email: formData.get('email') as string,
				password: formData.get('password') as string,
				role: formData.get('role') as 'admin' | 'user'
			}

			try {
				// TODO: 调用注册API
				console.log('注册数据:', data)

				// 模拟注册成功
				await new Promise((resolve) => setTimeout(resolve, 1000))
				setToken('demo-token')
				nav('/', { replace: true })
			} catch (error) {
				console.error('注册失败:', error)
			} finally {
				setLoading(false)
			}
		},
		[nav, setToken]
	)

	return (
		<div className='min-h-dvh grid place-items-center p-4'>
			<Card className='w-full max-w-[400px]'>
				<CardHeader>
					<CardTitle>创建账户</CardTitle>
				</CardHeader>
				<CardContent>
					<form className='space-y-4' onSubmit={onSubmit}>
						<div className='space-y-2'>
							<Label htmlFor='name'>姓名</Label>
							<Input
								id='name'
								name='name'
								type='text'
								placeholder='请输入您的姓名'
								required
							/>
						</div>

						<div className='space-y-2'>
							<Label htmlFor='email'>邮箱</Label>
							<Input
								id='email'
								name='email'
								type='email'
								placeholder='you@example.com'
								required
							/>
						</div>

						<div className='space-y-2'>
							<Label htmlFor='password'>密码</Label>
							<Input
								id='password'
								name='password'
								type='password'
								placeholder='请输入密码'
								required
							/>
						</div>

						<div className='space-y-2'>
							<Label htmlFor='role'>角色</Label>
							<select
								id='role'
								name='role'
								className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
								required
								defaultValue='user'>
								<option value='user'>普通用户</option>
								<option value='admin'>管理员</option>
							</select>
						</div>

						<Button className='w-full' type='submit' disabled={loading}>
							{loading ? '注册中...' : '注册'}
						</Button>

						<div className='text-center text-sm text-muted-foreground'>
							已有账户？{' '}
							<button
								type='button'
								onClick={() => nav('/login')}
								className='text-primary hover:underline'>
								立即登录
							</button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	)
}

export default Register
