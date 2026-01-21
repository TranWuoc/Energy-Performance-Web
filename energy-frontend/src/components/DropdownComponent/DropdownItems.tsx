import { useState, useRef, useEffect } from 'react';
import Input from '../Input';

export interface DropdownOption<T = number | string> {
    label: string;
    value: T;
}

interface DropdownItemsProps<T = number | string> {
    value?: T;
    onChange?: (val: T) => void;
    options: DropdownOption<T>[];
    placeholder?: string;
    className?: string;
    disabled?: boolean;
}

function DropdownItems<T = number | string>({
    value,
    onChange,
    options,
    placeholder = 'Chọn một mục',
    className = '',
    disabled = false,
}: DropdownItemsProps<T>) {
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const selected = options.find((o) => o.value === value)?.label || '';

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (val: T) => {
        onChange?.(val);
        setOpen(false);
    };

    return (
        <div className={`relative w-full text-left ${className}`} ref={menuRef}>
            <div className="relative flex w-full flex-row items-center">
                <Input
                    readOnly
                    value={selected}
                    placeholder={placeholder}
                    onClick={() => !disabled && setOpen((prev) => !prev)}
                    className={`w-full ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                />
                <img
                    src="/arrowDown.svg"
                    className={`pointer-events-none absolute right-2 h-[20px] w-[20px] transition-transform ${open ? 'rotate-180' : ''}`}
                />
            </div>
            {open && (
                <div className="absolute z-50 mt-2 max-h-[300px] w-full overflow-y-auto rounded-md bg-white shadow-lg">
                    <div className="flex flex-col">
                        {options.map((opt, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => handleSelect(opt.value)}
                                className={`h-[50px] w-full rounded-md px-4 text-left hover:bg-[#94DD8B] ${
                                    value === opt.value ? 'bg-[#119C59] text-white' : ''
                                }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default DropdownItems;
