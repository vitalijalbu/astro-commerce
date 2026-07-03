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
