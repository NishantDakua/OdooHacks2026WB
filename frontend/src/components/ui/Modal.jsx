function Modal({
	open,
	title,
	children,
	onClose,
}) {
	if (!open) {
		return null;
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
			<div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl">
				<div className="mb-4 flex items-start justify-between gap-4">
					<h2 className="text-xl font-semibold text-black">
						{title}
					</h2>

					<button
						type="button"
						onClick={onClose}
						className="text-sm font-semibold text-gray-500 transition hover:text-black"
					>
						Close
					</button>
				</div>

				{children}
			</div>
		</div>
	);
}

export default Modal;
