import TextField, { type TextFieldProps } from '@mui/material/TextField';
import { Controller, useFormContext } from 'react-hook-form';

type Props = TextFieldProps & {
    name: string;
};

export function RHFTextField({ name, ...props }: Props) {
    const { control } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <TextField
                    {...props}
                    {...field}
                    value={field.value ?? ''}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message ?? props.helperText}
                />
            )}
        />
    );
}
