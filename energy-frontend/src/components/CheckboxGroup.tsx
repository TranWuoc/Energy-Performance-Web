type CheckboxOptionProps = {
    options: Option[];
    selected: string[];
    onChange: (selected: string[]) => void;
};

type Option = {
    label: string;
    value: string;
};

function CheckboxGroup({ options, selected = [], onChange }: CheckboxOptionProps & { name: string }) {
    return (
        <div className=" flex flex-wrap gap-10">
            {(options || []).map((opt) => (
                <label key={opt.value} className=" flex items-center gap-2">
                    <input
                        type="checkbox"
                        value={opt.value}
                        checked={selected.includes(opt.value)}
                        onChange={(e) => {
                            if (e.target.checked) {
                                onChange([...selected, opt.value]);
                            } else {
                                onChange(selected.filter((v) => v !== opt.value));
                            }
                        }}
                    />
                    {opt.label}
                </label>
            ))}
        </div>
    );
}

export default CheckboxGroup;
