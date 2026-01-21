import { useState, useRef, useEffect } from 'react';

interface Option {
    label: string;
    value: number;
}

interface DropdownPickerYearProps {
    value: number | undefined;
    onSelected: (val: number) => void;
}

// Tạo danh sách năm từ 2020 đến năm hiện tại + 1
const currentYear = new Date().getFullYear();
const options: Option[] = Array.from({ length: currentYear - 2020 + 2 }, (_, i) => {
    const year = 2020 + i;
    return { label: `Năm ${year}`, value: year };
});

function DropdownPickerYear({ value, onSelected }: DropdownPickerYearProps) {
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative inline-block text-left" ref={menuRef}>
            <div className="flex flex-row items-center">
                <button
                    type="button"
                    onClick={() => setOpen((prev) => !prev)}
                    className="flex w-[150px] items-center rounded-md border border-gray-300 bg-[white] px-3 py-2 text-left hover:border-green-400"
                >
                    <span>{value ? `Năm ${value}` : 'Chọn năm'}</span>
                    <img src="/calenderLogo.svg" className="absolute right-1 h-[19px] w-[19px]" />
                </button>
            </div>
            {open && (
                <div className="absolute z-50 mt-2 w-[120px] rounded-md bg-white shadow-lg">
                    <div className="scrollbar-hidden max-h-[200px] overflow-y-auto">
                        {options.map((opt) => (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => {
                                    onSelected(opt.value);
                                    setOpen(false);
                                }}
                                className={`flex h-[40px] w-full items-center justify-center rounded-md hover:bg-[#94DD8B] ${
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

export default DropdownPickerYear;
