import MenuItem from '@mui/material/MenuItem';
import TextField, { type TextFieldProps } from '@mui/material/TextField';
import { Controller, useFormContext } from 'react-hook-form';

export type SelectOption<T extends string | number> = { label: string; value: T };

type Props<T extends string | number> = Omit<TextFieldProps, 'select' | 'onChange' | 'value'> & {
    name: string;
    options: SelectOption<T>[];
};

export function RHFSelectField<T extends string | number>({ name, options, ...props }: Props<T>) {
    const { control } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <TextField
                    {...props}
                    select
                    value={field.value ?? ''}
                    onChange={(e) => {
                        const v = e.target.value;
                        // giữ nguyên kiểu number nếu option là number
                        const casted = typeof options[0]?.value === 'number' ? Number(v) : (v as unknown as T);
                        field.onChange(casted);
                    }}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message ?? props.helperText}
                >
                    {options.map((op) => (
                        <MenuItem key={String(op.value)} value={op.value}>
                            {op.label}
                        </MenuItem>
                    ))}
                </TextField>
            )}
        />
    );
}
