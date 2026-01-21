import { Checkbox, FormControlLabel, type FormControlLabelProps } from '@mui/material';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

type Props = Omit<FormControlLabelProps, 'control' | 'labelPlacement'> & {
    name: string;
    fontWeight?: number | string;
    labelPlacement?: 'end' | 'start' | 'top' | 'bottom';
};

export default function RHFCheckbox({ name, label, disabled, fontWeight, labelPlacement = 'end', ...other }: Props) {
    const { control } = useFormContext();
    const readOnly = useWatch({ name: '__meta.readOnly' }) ?? false;
    const mergedDisabled = disabled ?? readOnly;

    return (
        <Controller
            name={name as any}
            control={control}
            render={({ field }) => (
                <FormControlLabel
                    control={<Checkbox checked={!!field.value} onChange={(e) => field.onChange(e.target.checked)} />}
                    label={<span style={fontWeight ? { fontWeight } : undefined}>{label}</span>}
                    labelPlacement={labelPlacement}
                    disabled={mergedDisabled}
                    {...other}
                />
            )}
        />
    );
}
