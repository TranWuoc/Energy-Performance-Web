import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

type Option = {
    label: string;
    value: string;
    to: string;
    onClick?: () => void;
};

interface DropdownMenuProps {
    optionLabel: string;
    options: Option[];
}

function DropdownMenu({ optionLabel, options }: DropdownMenuProps) {
    const [open, setOpen] = useState(false);
    const loacation = useLocation();

    return (
        <div className="relative inline-block text-left">
            <div
                className=" flex cursor-pointer items-center justify-between px-[20px] py-[10px] hover:text-[#119C59]"
                onClick={() => setOpen((prev) => !prev)}
            >
                <span>{optionLabel}</span>
                <img
                    src="/arrowDown.svg"
                    className={`pointer-events-none absolute right-2 h-[20px] w-[20px] transition-transform ${open ? 'rotate-180' : ''}`}
                />
            </div>
            {open && (
                <div className=" z-50 bg-[#ffff] py-[20px]">
                    <div className=" flex w-full flex-col gap-4">
                        {options.map((opt) => (
                            <Link
                                key={opt.value}
                                to={opt.to}
                                className={`rounded-r-2xl py-2 pl-10 text-[#241f1f] hover:bg-gray-100   ${loacation.pathname === opt.to ? 'bg-[#FFE3B3] ' : ''}`}
                            >
                                {opt.label}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default DropdownMenu;
