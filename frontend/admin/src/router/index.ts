// routes
import { createElement, lazy } from 'react'
import type { RouteObject } from 'react-router-dom'
import { Outlet } from 'react-router-dom'
import { RequireAuth } from './guard'
import AppLayout from '@/components/layout/AppLayout'

export type Meta = {
	auth?: boolean // 需登录
	roles?: Array<'admin' | 'user'>
	perms?: string[] // 细粒度权限点
}

declare module 'react-router-dom' {
	interface IndexRouteObject {
		meta?: Meta
	}
	interface NonIndexRouteObject {
		meta?: Meta
	}
}

const Login = lazy(() => import('@/pages/login'))
const Register = lazy(() => import('@/pages/register'))
const Dashboard = lazy(() => import('@/pages/dashboard'))

// 使用函数式组件以避免在 .ts 文件中直接写 JSX
const ProtectedLayout: React.FC = () => createElement(RequireAuth, null, createElement(Outlet))

const NotFound: React.FC = () => createElement('div', null, 'Not Found')

export const routes: RouteObject[] = [
	{ path: '/login', element: createElement(Login) },
	{ path: '/register', element: createElement(Register) },
	{
		path: '/',
		element: createElement(ProtectedLayout),
		children: [
			{
				element: createElement(AppLayout),
				children: [
					{ index: true, element: createElement(Dashboard), meta: { auth: true } },
					{ path: '*', element: createElement(NotFound) }
				]
			}
		]
	}
]
