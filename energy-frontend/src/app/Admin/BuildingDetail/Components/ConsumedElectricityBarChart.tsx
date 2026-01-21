// src/components/buildings/ConsumedElectricityBarChart.tsx
import { Box, Paper, Typography } from '@mui/material';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { ElectricityConsumption } from '../../../../api/buildings/building.type';
import { DATA_SOURCE_LABEL } from '../../../../constants';

type Props = {
    value: ElectricityConsumption;
    height?: number;
};

function ensure12Months(value: ElectricityConsumption) {
    const map = new Map<number, number>((value.monthlyData ?? []).map((m) => [m.month, m.energyConsumption]));

    return Array.from({ length: 12 }, (_, i) => {
        const month = i + 1;
        return { month: `T${month}`, kWh: map.get(month) ?? 0 };
    });
}

export default function ConsumedElectricityBarChart({ value, height = 320 }: Props) {
    const data = ensure12Months(value);

    return (
        <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography sx={{ fontWeight: 800, mb: 0.5 }}>Điện tiêu thụ theo tháng — Năm {value.year}</Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Nguồn dữ liệu: {DATA_SOURCE_LABEL[value.dataSource] ?? `#${value.dataSource ?? '-'}`}
            </Typography>

            <Box sx={{ width: '100%', height }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(v: any) => [`${v} kWh`, 'Tiêu thụ']} />
                        <Bar dataKey="kWh" fill="#1f2f1f" barSize={20} />
                    </BarChart>
                </ResponsiveContainer>
            </Box>
        </Paper>
    );
}
