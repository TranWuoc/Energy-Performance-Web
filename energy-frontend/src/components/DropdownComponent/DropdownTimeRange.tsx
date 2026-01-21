import { useState, useRef, useEffect } from 'react';
import Input from '../Input';

interface Option {
    label: string;
    value: string;
}

interface TimeRange {
    from: string | null;
    to: string | null;
}

interface DropdownTimeRangeProps {
    value?: TimeRange | null;
    onChange?: (val: TimeRange) => void;
    placeholderFrom?: string;
    placeholderTo?: string;
    label?: string;
    className?: string;
    inputWidth?: string; // Khi dùng với InputField, prop này sẽ được truyền vào
}

const DEFAULT_INPUT_WIDTH = 'w-[70px]';

// Tạo danh sách giờ từ 00:00 đến 23:45 (interval 15 phút)
const options: Option[] = Array.from({ length: 24 * 4 }, (_, i) => {
    const hour = Math.floor(i / 4);
    const minute = (i % 4) * 15;
    const label = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    return { label, value: label };
});

function DropdownTimeRange({
    value,
    onChange,
    placeholderFrom = 'Từ',
    placeholderTo = 'Đến',
    label,
    className = '',
    inputWidth,
}: DropdownTimeRangeProps) {
    const [openFrom, setOpenFrom] = useState(false);
    const [openTo, setOpenTo] = useState(false);
    const fromRef = useRef<HTMLDivElement>(null);
    const toRef = useRef<HTMLDivElement>(null);

    // Nếu có inputWidth (từ InputField) thì dùng flex-1, không thì dùng default
    const widthClass = inputWidth ? 'flex-1' : DEFAULT_INPUT_WIDTH;

    const currentValue: TimeRange = value || { from: null, to: null };

    const handleFromChange = (val: string | null) => {
        onChange?.({ ...currentValue, from: val });
    };

    const handleToChange = (val: string | null) => {
        onChange?.({ ...currentValue, to: val });
    };

    const handleClearFrom = (e: React.MouseEvent) => {
        e.stopPropagation();
        handleFromChange(null);
    };

    const handleClearTo = (e: React.MouseEvent) => {
        e.stopPropagation();
        handleToChange(null);
    };

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (fromRef.current && !fromRef.current.contains(event.target as Node)) {
                setOpenFrom(false);
            }
            if (toRef.current && !toRef.current.contains(event.target as Node)) {
                setOpenTo(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Lọc options cho "Đến" (chỉ hiển thị giờ sau "Từ")
    const filteredToOptions = currentValue.from ? options.filter((opt) => opt.value > currentValue.from!) : options;

    return (
        <div className={`flex w-full items-center gap-2 ${className}`}>
            {label && <span className="shrink-0 text-sm font-medium">{label}</span>}

            {/* Start Time */}
            <div className={`relative ${widthClass}`} ref={fromRef}>
                <div className="relative flex items-center">
                    <Input
                        readOnly
                        value={currentValue.from || ''}
                        placeholder={placeholderFrom}
                        onClick={() => setOpenFrom((prev) => !prev)}
                        className="w-full cursor-pointer"
                    />
                    {currentValue.from ? (
                        <button
                            type="button"
                            onClick={handleClearFrom}
                            className="absolute right-2 flex h-4 w-4 items-center justify-center rounded-full bg-gray-300 text-xs hover:bg-gray-400"
                        >
                            ✕
                        </button>
                    ) : (
                        <img src="/timeLogo.svg" className="pointer-events-none absolute right-2 h-5 w-5" />
                    )}
                </div>

                {openFrom && (
                    <div className="absolute z-50 mt-2 w-full min-w-[120px] rounded-md bg-white shadow-lg">
                        <div className="scrollbar-hidden h-[300px] overflow-y-auto">
                            {options.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => {
                                        handleFromChange(opt.value);
                                        setOpenFrom(false);
                                        // Reset "to" nếu nó nhỏ hơn "from" mới
                                        if (currentValue.to && opt.value >= currentValue.to) {
                                            handleToChange(null);
                                        }
                                    }}
                                    className={`flex h-10 w-full items-center justify-center hover:bg-[#94DD8B] ${
                                        currentValue.from === opt.value ? 'bg-[#119C59] text-white' : ''
                                    }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <span className="shrink-0 text-gray-500">→</span>

            {/* End Time */}
            <div className={`relative ${widthClass}`} ref={toRef}>
                <div className="relative flex items-center">
                    <Input
                        readOnly
                        value={currentValue.to || ''}
                        placeholder={placeholderTo}
                        onClick={() => setOpenTo((prev) => !prev)}
                        className="w-full cursor-pointer"
                    />
                    {currentValue.to ? (
                        <button
                            type="button"
                            onClick={handleClearTo}
                            className="absolute right-2 flex h-4 w-4 items-center justify-center rounded-full bg-gray-300 text-xs hover:bg-gray-400"
                        >
                            ✕
                        </button>
                    ) : (
                        <img src="/timeLogo.svg" className="pointer-events-none absolute right-2 h-5 w-5" />
                    )}
                </div>

                {openTo && (
                    <div className="absolute z-50 mt-2 w-full min-w-[120px] rounded-md bg-white shadow-lg">
                        <div className="scrollbar-hidden h-[300px] overflow-y-auto">
                            {filteredToOptions.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => {
                                        handleToChange(opt.value);
                                        setOpenTo(false);
                                    }}
                                    className={`flex h-10 w-full items-center justify-center hover:bg-[#94DD8B] ${
                                        currentValue.to === opt.value ? 'bg-[#119C59] text-white' : ''
                                    }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default DropdownTimeRange;
