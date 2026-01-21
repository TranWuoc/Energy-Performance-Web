import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs, { type Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Controller, useFormContext } from 'react-hook-form';

dayjs.extend(customParseFormat);

type TimeValue = string | null;

interface RHFTimeFieldProps {
    name: string;
    label: string;
    width?: number; // default 150
    minutesStep?: number; // default 5
    minTime?: Dayjs; // min selectable time
    disabled?: boolean;
}

function strToDayjs(v: TimeValue): Dayjs | null {
    if (!v) return null;
    const d = dayjs(v, 'HH:mm', true);
    return d.isValid() ? d : null;
}

function dayjsToStr(d: Dayjs | null): TimeValue {
    if (!d) return null;
    return d.format('HH:mm');
}

export function RHFTimeField({ name, label, width = 150, minutesStep = 5, minTime, disabled }: RHFTimeFieldProps) {
    const { control } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => {
                const pickerValue = strToDayjs((field.value ?? null) as TimeValue);

                return (
                    <TimePicker
                        label={label}
                        value={pickerValue}
                        onChange={(val) => field.onChange(dayjsToStr(val))}
                        minutesStep={minutesStep}
                        minTime={minTime}
                        disabled={disabled}
                        slotProps={{
                            textField: {
                                size: 'small',
                                sx: { width },
                                error: !!fieldState.error,
                                helperText: fieldState.error?.message,
                            },
                        }}
                    />
                );
            }}
        />
    );
}
