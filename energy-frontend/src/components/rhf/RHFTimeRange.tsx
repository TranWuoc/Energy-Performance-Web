import Box from '@mui/material/Box';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { RHFTimeField } from './RHFTimeField';

interface RHFTimeRangeProps {
    name: string;
    label: string;
    minutesStep?: number; // default 5
}
function toMinTime(from: string | null | undefined): Dayjs | undefined {
    if (!from) return undefined;
    const d = dayjs(from, 'HH:mm', true);
    return d.isValid() ? d : undefined;
}

export function RHFTimeRange({ name, label, minutesStep = 5 }: RHFTimeRangeProps) {
    const { watch, setValue } = useFormContext();

    const from = watch(`${name}.from`);
    const to = watch(`${name}.to`);
    const minTime = useMemo(() => toMinTime(from), [from]);

    useEffect(() => {
        if (from && to && to < from) {
            setValue(`${name}.to`, null);
        }
    }, [from, to, name, setValue]);

    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: '160px 150px 150px',
                alignItems: 'center',
                gap: 1.5,
            }}
        >
            <Box sx={{ fontWeight: 600 }}>{label}</Box>

            <RHFTimeField name={`${name}.from`} label="From" minutesStep={minutesStep} />

            <RHFTimeField name={`${name}.to`} label="To" minutesStep={minutesStep} minTime={minTime} disabled={!from} />
        </Box>
    );
}
