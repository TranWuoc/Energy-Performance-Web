import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Controller, useFormContext } from 'react-hook-form';

type Props = {
    name: string;
    label: string;
    disabled?: boolean;
};

export function RHFCheckboxField({ name, label, disabled }: Props) {
    const { control } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={!!field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                            disabled={disabled}
                        />
                    }
                    label={label}
                />
            )}
        />
    );
}
