import { Box, Chip, FormControl, InputLabel, MenuItem, Paper, Select, Typography } from '@mui/material';
import React, { useMemo, useState } from 'react';
import type { ProducedElectricityYear } from '../../../Usage/NewSurvey/type/type';

type Props = {
    produced?: ProducedElectricityYear[];
};

function ValueRow({ k, v }: { k: string; v: any }) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {k}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                {v === null || v === undefined || v === '' ? '-' : String(v)}
            </Typography>
        </Box>
    );
}

function EnergyCard({ title, rows }: { title: string; rows: Array<{ k: string; v: any }> }) {
    return (
        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 1,
                }}
            >
                <Typography sx={{ fontWeight: 800 }}>{title}</Typography>
                <Chip
                    size="small"
                    label="Đang sử dụng"
                    sx={{
                        backgroundColor: '#E8F5E9',
                        color: '#2E7D32',
                        fontWeight: 700,
                    }}
                />
            </Box>

            <Box sx={{ display: 'grid', gap: 0.75 }}>
                {rows.map((r) => (
                    <ValueRow key={r.k} k={r.k} v={r.v} />
                ))}
            </Box>
        </Paper>
    );
}

export default function ProducedElectricitySection({ produced }: Props) {
    const list = produced ?? [];

    const years = useMemo(() => [...list.map((x) => x.year)].sort((a, b) => b - a), [list]);

    const [selectedYear, setSelectedYear] = useState<number>(years[0] ?? new Date().getFullYear());

    const selected = useMemo(() => list.find((x) => x.year === selectedYear) ?? list[0], [list, selectedYear]);

    if (!list.length) {
        return (
            <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    Điện sản xuất (Produced Electricity)
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Chưa có dữ liệu điện sản xuất.
                </Typography>
            </Box>
        );
    }

    // ✅ Ẩn nguồn không selected
    const cards = useMemo(() => {
        if (!selected) return [];

        const result: Array<React.ReactNode> = [];

        if (selected.solar?.isSelected) {
            result.push(
                <EnergyCard
                    key="solar"
                    title="Solar"
                    rows={[
                        { k: 'Diện tích lắp đặt', v: selected.solar.installedArea },
                        { k: 'Công suất lắp đặt', v: selected.solar.installedCapacity },
                        { k: 'Hiệu suất trung bình của hệ thống', v: selected.solar.averageEfficiency },
                        { k: 'Số giờ nắng trung bình/ năm', v: selected.solar.averageSunHoursPerYear },
                        { k: 'Tổn thất hệ thống', v: selected.solar.systemLosses },
                    ]}
                />,
            );
        }

        if (selected.wind?.isSelected) {
            result.push(
                <EnergyCard
                    key="wind"
                    title="Wind"
                    rows={[
                        { k: 'Số lượng tua bin gió', v: selected.wind.turbineCount },
                        { k: 'Công suất mỗi turbine', v: selected.wind.turbineCapacity },
                        { k: 'Vận tốc gió trung bình khu vực', v: selected.wind.averageWindSpeed },
                        { k: 'Thời gian vận hành', v: selected.wind.operatingHoursPerYear },
                        { k: 'Hệ số công suất', v: selected.wind.capacityFactor },
                    ]}
                />,
            );
        }

        if (selected.geothermal?.isSelected) {
            result.push(
                <EnergyCard
                    key="geothermal"
                    title="Geothermal"
                    rows={[
                        { k: 'Công suất lắp đặt', v: selected.geothermal.installedCapacity },
                        { k: 'Nhiệt độ nguồn địa nhiệt', v: selected.geothermal.sourceTemperature },
                        { k: 'Thời gian vận hành', v: selected.geothermal.operatingHoursPerYear },
                        { k: 'Hiệu suất hệ thống (COP)', v: selected.geothermal.systemCOP },
                    ]}
                />,
            );
        }

        return result;
    }, [selected]);

    return (
        <Box>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Điện sản xuất (Produced Electricity)
                </Typography>

                <FormControl size="small" sx={{ minWidth: 140 }}>
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

            {cards.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                    Năm {selectedYear}: Không có nguồn năng lượng tái tạo đang sử dụng.
                </Typography>
            ) : (
                <Box
                    sx={{
                        display: 'grid',
                        gap: 2,
                        gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                    }}
                >
                    {cards}
                </Box>
            )}
        </Box>
    );
}
