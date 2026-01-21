import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';
import { Controller, useFormContext } from 'react-hook-form';

function toDayjs(value: any) {
    if (!value) return null;
    if (typeof value === 'string') return dayjs(value, 'HH:mm');
    if (value?.isValid?.()) return value;
    return null;
}

function toString(value: any) {
    if (!value) return null;
    // dayjs -> "HH:mm"
    if (value?.format) return value.format('HH:mm');
    return null;
}

export default function RHFTimePicker({ name, label, disabled }: any) {
    const { control } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <TimePicker
                    label={label}
                    value={toDayjs(field.value)}
                    onChange={(newValue) => field.onChange(toString(newValue))}
                    disabled={disabled}
                    slotProps={{
                        textField: {
                            error: !!fieldState.error,
                            helperText: fieldState.error?.message,
                            size: 'small',
                            fullWidth: true,
                        } as any,
                    }}
                />
            )}
        />
    );
}
