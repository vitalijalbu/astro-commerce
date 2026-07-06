export const DRAWER_DURATION = 500;

export function closeDrawer(drawer: HTMLDialogElement) {
	if (drawer.hasAttribute('data-closing')) return;
	drawer.setAttribute('data-closing', '');
	setTimeout(() => {
		drawer.close();
		drawer.removeAttribute('data-closing');
	}, DRAWER_DURATION);
}

export function initDrawerCancel(drawer: HTMLDialogElement) {
	drawer.addEventListener('cancel', (e) => {
		e.preventDefault();
		closeDrawer(drawer);
	});
}

export function initDrawerBackdrop(drawer: HTMLDialogElement) {
	drawer.addEventListener('click', (e) => {
		if (e.target === drawer) closeDrawer(drawer);
	});
}

export function initBasecoatDropdowns() {
	document.querySelectorAll<HTMLElement>('.dropdown-menu:not([data-bound])').forEach(root => {
		root.dataset.bound = 'true'
		const trigger = root.querySelector<HTMLButtonElement>(':scope > button')
		const popover = root.querySelector<HTMLElement>(':scope > [data-popover]')
		const menu = popover?.querySelector<HTMLElement>('[role="menu"]')
		if (!trigger || !popover || !menu) return

		trigger.setAttribute('aria-expanded', 'false')
		popover.setAttribute('aria-hidden', 'true')

		const items = Array.from(menu.querySelectorAll<HTMLElement>('[role="menuitem"]'))
		let activeIndex = -1

		const close = (focusTrigger = true) => {
			trigger.setAttribute('aria-expanded', 'false')
			popover.setAttribute('aria-hidden', 'true')
			if (activeIndex > -1 && items[activeIndex]) {
				items[activeIndex].classList.remove('active')
			}
			activeIndex = -1
			if (focusTrigger) trigger.focus()
		}

		const open = () => {
			trigger.setAttribute('aria-expanded', 'true')
			popover.setAttribute('aria-hidden', 'false')
		}

		const openAndFocus = (index = 0) => {
			open()
			if (items[index]) {
				activeIndex = index
				items[index].classList.add('active')
				items[index].focus()
			}
		}

		trigger.addEventListener('click', () => {
			const expanded = trigger.getAttribute('aria-expanded') === 'true'
			expanded ? close() : openAndFocus()
		})

		trigger.addEventListener('keydown', (e: KeyboardEvent) => {
			if (e.key === 'ArrowDown') { e.preventDefault(); openAndFocus(0) }
			if (e.key === 'ArrowUp') { e.preventDefault(); openAndFocus(items.length - 1) }
			if (e.key === 'Escape') { e.preventDefault(); close() }
		})

		menu.addEventListener('keydown', (e: KeyboardEvent) => {
			const current = items.indexOf(e.target as HTMLElement)
			if (e.key === 'ArrowDown') {
				e.preventDefault()
				const next = (current + 1) % items.length
				items.forEach(i => i.classList.remove('active'))
				activeIndex = next
				items[next].classList.add('active')
				items[next].focus()
			}
			if (e.key === 'ArrowUp') {
				e.preventDefault()
				const prev = (current - 1 + items.length) % items.length
				items.forEach(i => i.classList.remove('active'))
				activeIndex = prev
				items[prev].classList.add('active')
				items[prev].focus()
			}
			if (e.key === 'Escape') { e.preventDefault(); close() }
			if (e.key === 'Tab') { close(false) }
		})

		menu.addEventListener('click', (e: MouseEvent) => {
			const item = (e.target as HTMLElement).closest('[role="menuitem"]')
			if (item && item.getAttribute('href')) {
				if (!item.getAttribute('href')!.startsWith('#')) {
					close(false)
				}
			}
		})

		document.addEventListener('click', (e: MouseEvent) => {
			if (!root.contains(e.target as HTMLElement) && trigger.getAttribute('aria-expanded') === 'true') {
				close()
			}
		})
	})
}
