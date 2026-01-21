import { Box, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import type { ElectricityConsumption } from '../../../../api/buildings/building.type';
import ConsumedElectricityBarChart from '../Components/ConsumedElectricityBarChart';

type Props = {
    consumed: ElectricityConsumption[];
};

export default function ConsumedElectricitySection({ consumed }: Props) {
    const years = useMemo(() => [...consumed.map((x) => x.year)].sort((a, b) => b - a), [consumed]);

    const [selectedYear, setSelectedYear] = useState<number>(years[0] ?? new Date().getFullYear());

    const selected = useMemo(
        () => consumed.find((x) => x.year === selectedYear) ?? consumed[0],
        [consumed, selectedYear],
    );

    if (!consumed || consumed.length === 0) {
        return (
            <Typography variant="body2" color="text.secondary">
                Chưa có dữ liệu tiêu thụ điện.
            </Typography>
        );
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Điện tiêu thụ (Consumed Electricity)
                </Typography>

                <FormControl size="small" sx={{ minWidth: 160 }}>
                    <InputLabel>Năm</InputLabel>
                    <Select label="Năm" value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}>
                        {years.map((y) => (
                            <MenuItem key={y} value={y}>
                                {y}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {selected ? <ConsumedElectricityBarChart value={selected} /> : null}
        </Box>
    );
}
