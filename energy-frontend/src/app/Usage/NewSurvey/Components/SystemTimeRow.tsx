import { Box, Typography } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs, { Dayjs } from 'dayjs';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

function toDayjs(v: string | null): Dayjs | null {
    return v ? dayjs(v, 'HH:mm') : null;
}
function toString(v: Dayjs | null): string | null {
    return v ? v.format('HH:mm') : null;
}

type Props = {
    label: string;
    baseName: string;
    disabled?: boolean;
    placeholder?: string;
};

export function SystemTimeRow({ label, disabled, baseName, placeholder = '--:--' }: Props) {
    const { control } = useFormContext();
    const readOnly = useWatch({ name: '__meta.readOnly' }) ?? false;
    const mergedDisabled = disabled ?? readOnly;

    const fromPath = `${baseName}.from`;
    const toPath = `${baseName}.to`;

    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '220px 1fr 1fr' },
                gap: 2,
                alignItems: 'center',
            }}
        >
            <Typography fontWeight={600}>{label}</Typography>

            <Controller
                name={fromPath as any}
                control={control}
                defaultValue={null}
                render={({ field, fieldState }) => (
                    <TimePicker
                        label="From"
                        value={toDayjs(field.value)}
                        onChange={(v) => field.onChange(toString(v))}
                        ampm={false}
                        format="HH:mm"
                        disabled={mergedDisabled}
                        slotProps={{
                            textField: {
                                fullWidth: true,
                                placeholder,
                                error: !!fieldState.error,
                                helperText: fieldState.error?.message,
                                inputProps: { placeholder },
                            },
                        }}
                    />
                )}
            />

            <Controller
                name={toPath as any}
                control={control}
                defaultValue={null}
                render={({ field, fieldState }) => (
                    <TimePicker
                        label="To"
                        value={toDayjs(field.value)}
                        onChange={(v) => field.onChange(toString(v))}
                        ampm={false}
                        format="HH:mm"
                        disabled={mergedDisabled}
                        slotProps={{
                            textField: {
                                fullWidth: true,
                                placeholder,
                                error: !!fieldState.error,
                                helperText: fieldState.error?.message,
                                inputProps: { placeholder },
                            },
                        }}
                    />
                )}
            />
        </Box>
    );
}
