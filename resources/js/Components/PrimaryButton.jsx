export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center justify-center rounded-lg border border-transparent bg-[#0968f6] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white transition duration-150 ease-in-out hover:bg-[#0049b8] focus:bg-[#0049b8] focus:outline-none focus:ring-2 focus:ring-[#0968f6] focus:ring-offset-2 active:bg-[#002a69] ${
                    disabled && 'opacity-50 cursor-not-allowed'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
