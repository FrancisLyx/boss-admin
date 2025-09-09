// routers/guards
import { createElement } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/store/auth'

export const RequireAuth: React.FC<React.PropsWithChildren> = ({ children }) => {
	const { token, loading } = useAuth() // loading: 正在拉取 /me
	const loc = useLocation()

	// 避免闪屏：loading 期间不渲染任何内容
	if (loading) return null

	// 未登录则跳转登录页，并记录来源路径
	if (!token)
		return createElement(Navigate, {
			to: '/login',
			replace: true,
			state: { from: loc },
		})

	return children
}
