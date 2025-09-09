import { create } from 'zustand'

type Me = { id: string; name: string; role: 'admin' | 'user' }
type AuthState = {
	token?: string
	me?: Me
	abilities: Set<string>
	loading: boolean
	setToken: (t?: string) => void
	bootstrap: () => Promise<void> // 拉取 /me 与权限
}

export const useAuth = create<AuthState>((set, get) => ({
	token: localStorage.getItem('token') ?? undefined,
	me: undefined,
	abilities: new Set(),
	loading: true,
	setToken: (t) => {
		t ? localStorage.setItem('token', t) : localStorage.removeItem('token')
		set({ token: t })
	},
	bootstrap: async () => {
		const token = get().token
		if (!token) return set({ loading: false })
		try {
			// TODO 权限接口
		} catch {
			set({ token: undefined, loading: false })
		}
	}
}))
