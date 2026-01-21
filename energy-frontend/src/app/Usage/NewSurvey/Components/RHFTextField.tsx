import { TextField as MuiTextField, type TextFieldProps } from '@mui/material';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

type Props = TextFieldProps & {
    name: string;
    numberEmptyAsZero?: boolean;
};

export default function RHFTextField({ name, disabled, type, numberEmptyAsZero = false, inputProps, ...other }: Props) {
    const { control } = useFormContext();
    const readOnly = useWatch({ name: '__meta.readOnly' }) ?? false;
    const mergedDisabled = disabled ?? readOnly;

    const isNumber = type === 'number';

    return (
        <Controller
            name={name as any}
            control={control}
            render={({ field, fieldState }) => (
                <MuiTextField
                    {...other}
                    name={name}
                    inputRef={field.ref}
                    type={type}
                    fullWidth
                    disabled={mergedDisabled}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    value={field.value === null || field.value === undefined ? '' : field.value}
                    onChange={(e) => {
                        const raw = e.target.value;

                        if (isNumber) {
                            if (raw === '') {
                                field.onChange(numberEmptyAsZero ? 0 : null);
                                return;
                            }

                            const n = Number(raw);
                            field.onChange(Number.isNaN(n) ? (numberEmptyAsZero ? 0 : null) : n);
                            return;
                        }

                        field.onChange(raw);
                    }}
                    inputProps={{
                        ...inputProps,
                        ...(isNumber ? { inputMode: 'numeric' } : null),
                    }}
                    onKeyDown={
                        isNumber
                            ? (e) => {
                                  if (
                                      ['e', 'E', '+', '-'].includes(e.key) ||
                                      (e.ctrlKey && ['v', 'c', 'x', 'a'].includes(e.key.toLowerCase()))
                                  ) {
                                      e.preventDefault();
                                  }
                              }
                            : undefined
                    }
                />
            )}
        />
    );
}
