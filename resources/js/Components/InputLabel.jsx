export default function InputLabel({
    value,
    className = '',
    children,
    ...props
}) {
    return (
        <label
            {...props}
            className={
                `block text-sm font-medium text-content-primary ` +
                className
            }
        >
            {value ? value : children}
        </label>
    );
}
