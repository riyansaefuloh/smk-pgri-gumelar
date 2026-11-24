import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export default forwardRef(function TextInput(
    { type = 'text', className = '', isFocused = false, ...props },
    ref,
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <input
            {...props}
            type={type}
            className={
                'rounded-lg border-[#d0d5dd] text-sm text-[#1f1f1f] shadow-xs focus:border-[#0968f6] focus:ring-2 focus:ring-[#0968f6]/15 outline-none transition font-inter ' +
                className
            }
            ref={localRef}
        />
    );
});
