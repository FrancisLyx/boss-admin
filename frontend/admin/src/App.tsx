import './App.css'
import { Suspense, useEffect } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { routes } from '@/router'
import { useAuth } from '@/store/auth'
import Spinner from '@/components/common/Spinner'

const router = createBrowserRouter(routes)

function App() {
	const { bootstrap } = useAuth()

	useEffect(() => {
		bootstrap()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<Suspense
			fallback={
				<div className="min-h-dvh grid place-items-center">
					<Spinner size={32} />
				</div>
			}
		>
			<RouterProvider router={router} />
		</Suspense>
	)
}

export default App
