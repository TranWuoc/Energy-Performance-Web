interface CheckboxProps {
    value?: boolean;
    onChange?: (val: boolean) => void;
    label?: string;
    placeholder?: string;
}

function Checkbox({ value = false, onChange, label, placeholder }: CheckboxProps) {
    const displayLabel = label || placeholder;

    return (
        <label className="flex cursor-pointer items-center gap-2">
            <input
                type="checkbox"
                checked={value}
                onChange={(e) => onChange?.(e.target.checked)}
                className="h-5 w-5 cursor-pointer accent-[#119C59]"
            />
            <span className="text-gray-700">{displayLabel}</span>
        </label>
    );
}

export default Checkbox;
