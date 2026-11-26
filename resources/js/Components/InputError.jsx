export default function InputError({ message, className = '', ...props }) {
    return message ? (
        <p
            {...props}
            className={'text-sm text-content-negative ' + className}
        >
            {message}
        </p>
    ) : null;
}
