export default function Counter() {
	// function controlConcurrent<T>(arr: Array<() => Promise<T>>, max: number): void {
	// 	let running = 0 // 当前正在执行的请求数
	// 	let index = 0 // 当前要执行的请求索引

	// 	function runNext(): void {
	// 		// 如果所有请求都已执行完，或者当前正在执行的请求数达到最大值，则返回
	// 		if (index >= arr.length || running >= max) {
	// 			return
	// 		}

	// 		running++ // 增加正在执行的请求数
	// 		const currentIndex = index
	// 		index++

	// 		// 执行当前请求（在 noUncheckedIndexedAccess 下需要判空）
	// 		const fn = arr[currentIndex]
	// 		if (!fn) {
	// 			// 若意外出现空位，释放一个并尝试下一个
	// 			running--
	// 			runNext()
	// 			return
	// 		}

	// 		fn()
	// 			.then(() => {
	// 				console.log(`请求 ${currentIndex + 1} 完成`)
	// 			})
	// 			.catch((err) => {
	// 				console.error(`请求 ${currentIndex + 1} 失败:`, err)
	// 			})
	// 			.finally(() => {
	// 				running-- // 减少正在执行的请求数
	// 				runNext() // 执行下一个请求
	// 			})
	// 	}

	// 	for (let i = 0; i < max; i++) {
	// 		runNext()
	// 	}
	// }

	// 接口并发控制，并行数量3,3个接口执行完成后，再次执行后面的接口

	const controlConcurrent = (arr: Array<() => Promise<Response>>, max: number) => {
		// 记录两个数据，一个是执行的索引，另一个是当前执行的数据
		let currentIndex = 0
		let running = 0

		const runNext = () => {
			// 递归出口
			if (currentIndex >= arr.length || running >= max) {
				return
			}
			running++
			let index = currentIndex
			currentIndex++

			let fn = arr[index]
			if (!fn) {
				running--
				runNext()
				return
			}
			fn()
				.then()
				.catch()
				.finally(() => {
					running--
					runNext()
				})
		}

		for (let i = 0; i < max; i++) {
			runNext()
		}
	}

	const arr: Array<() => Promise<Response>> = [
		() => fetch('https://imber.netlify.app/api?time=2'),
		() => fetch('https://imber.netlify.app/api?time=3'),
		() => fetch('https://imber.netlify.app/api?time=2'),
		() => fetch('https://imber.netlify.app/api?time=1'),
		() => fetch('https://imber.netlify.app/api?time=3'),
		() => fetch('https://imber.netlify.app/api?time=2')
	]

	return (
		<div>
			<button onClick={() => controlConcurrent(arr, 3)}>控制请求并发</button>
			<div>结果在控制台查看接口请求</div>
		</div>
	)
}
