import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import {
    Box,
    Button,
    Card,
    Divider,
    IconButton,
    Paper,
    Stack,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Tabs,
    Typography,
} from '@mui/material';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';

import RHFCheckbox from '../Components/RHFCheckbox';
import RHFSelect from '../Components/RHFSelect';
import RHFTextField from '../Components/RHFTextField';
import type { BuildingFormValues } from '../type/type';
import { getLast3CompletedYears } from '../utils/yearOptions';

const DATA_SOURCE_OPTIONS = [
    { label: 'Hoá đơn điện hàng tháng', value: 1 },
    { label: 'Công tơ điện & Báo cáo kiểm toán', value: 2 },
];

function buildRenewableDefault(year: number) {
    return {
        year,
        solar: {
            isSelected: false,
            installedArea: null,
            installedCapacity: null,
            averageEfficiency: null,
            averageSunHoursPerYear: null,
            systemLosses: null,
        },
        wind: {
            isSelected: false,
            turbineCount: null,
            turbineCapacity: null,
            averageWindSpeed: null,
            operatingHoursPerYear: null,
            capacityFactor: null,
        },
        geothermal: {
            isSelected: false,
            installedCapacity: null,
            sourceTemperature: null,
            operatingHoursPerYear: null,
            systemCOP: null,
        },
    };
}

function build12Months() {
    return Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        energyConsumption: null as number | null,
    }));
}

function getNextAvailableYear(usedYears: number[], baseYear: number) {
    for (let y = baseYear; y >= baseYear - 50; y--) {
        if (!usedYears.includes(y)) return y;
    }
    return baseYear;
}
export default function MonthlyElectricStep({ disabled }: { disabled?: boolean }) {
    const [tab, setTab] = useState(0);
    const { watch, setValue, getValues } = useFormContext<BuildingFormValues>();
    const readOnly = useWatch({ name: '__meta.readOnly' }) ?? false;
    const mergedDisabled = disabled ?? readOnly;
    const { fields, append, remove } = useFieldArray({ name: 'consumedElectricity' });
    const {
        fields: producedFields,
        append: appendProduced,
        remove: removeProduced,
    } = useFieldArray({
        name: 'producedElectricity',
    });

    const currentYear = new Date().getFullYear();

    const yearOptions = useMemo(() => getLast3CompletedYears(), []);

    const consumedElectricity = watch('consumedElectricity') || [];

    useEffect(() => {
        consumedElectricity.forEach((_, idx) => {
            const md = getValues(`consumedElectricity.${idx}.monthlyData`);
            if (!md || md.length !== 12) {
                setValue(`consumedElectricity.${idx}.monthlyData`, build12Months() as any, {
                    shouldDirty: true,
                });
            }
            const ds = getValues(`consumedElectricity.${idx}.dataSource`);
            if (ds === null || ds === undefined) {
                setValue(`consumedElectricity.${idx}.dataSource`, 1 as any, { shouldDirty: true });
            }
            for (let i = 0; i < 12; i++) {
                setValue(`consumedElectricity.${idx}.monthlyData.${i}.month`, (i + 1) as any, {
                    shouldDirty: false,
                });
            }
        });
    }, [consumedElectricity.length]);

    const initConsumedRef = useRef(false);

    useEffect(() => {
        if (initConsumedRef.current) return;
        initConsumedRef.current = true;

        const current = getValues('consumedElectricity') || [];
        if (current.length === 0) {
            append({
                year: currentYear,
                dataSource: 1,
                monthlyData: build12Months(),
            } as any);
        }
    }, [append, currentYear, getValues]);

    useEffect(() => {
        const arr = (getValues('producedElectricity') || []) as any[];
        if (!arr.length) {
            appendProduced(buildRenewableDefault(currentYear) as any);
        }
    }, []);

    const handleAddYear = useCallback(() => {
        const usedYears = (getValues('consumedElectricity') || [])
            .map((e) => Number(e?.year))
            .filter((y) => !Number.isNaN(y));
        const nextYear = getNextAvailableYear(usedYears, currentYear);
        append({
            year: nextYear,
            dataSource: 1,
            monthlyData: build12Months(),
        } as any);
    }, [append, currentYear, getValues]);
    const handleAddProducedYear = useCallback(() => {
        const arr = (getValues('producedElectricity') || []) as any[];
        const usedYears = arr.map((e) => Number(e?.year)).filter((y) => !Number.isNaN(y));

        const nextYear = getNextAvailableYear(usedYears, currentYear);
        appendProduced(buildRenewableDefault(nextYear) as any);
    }, [appendProduced, currentYear, getValues]);

    return (
        <Stack spacing={2}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
                {tab === 0 && (
                    <Button variant="contained" onClick={handleAddYear} disabled={mergedDisabled}>
                        Thêm năm
                    </Button>
                )}
                {tab === 1 && (
                    <Button variant="contained" onClick={handleAddProducedYear} disabled={mergedDisabled}>
                        Thêm năm
                    </Button>
                )}
            </Stack>
            <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
                <Tabs
                    value={tab}
                    onChange={(_, v) => setTab(v)}
                    sx={{ px: 2, borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
                >
                    <Tab label="Điện năng tiêu thụ hàng tháng" />
                    <Tab label="Năng lượng tái tạo" />
                </Tabs>
                {tab === 0 && (
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: '1fr', // mobile: 1 cột
                                md: '1fr 1fr', // desktop: 2 cột
                            },
                            px: 2,
                            py: 3,
                            gap: 2,
                        }}
                    >
                        {(fields || []).map((f, idx) => (
                            <Paper
                                key={f.id}
                                variant="outlined"
                                sx={{
                                    overflow: 'hidden',
                                    height: '100%',
                                }}
                            >
                                {/* ===== HEADER ===== */}
                                <Box sx={{ p: 2 }}>
                                    <Stack
                                        direction={{ xs: 'column', sm: 'row' }}
                                        spacing={2}
                                        alignItems={{ sm: 'center' }}
                                        justifyContent="space-between"
                                    >
                                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                            <Box sx={{ minWidth: 180 }}>
                                                <RHFSelect
                                                    name={`consumedElectricity.${idx}.year`}
                                                    label="Năm"
                                                    options={yearOptions}
                                                />
                                            </Box>

                                            <Box sx={{ minWidth: 260 }}>
                                                <RHFSelect
                                                    name={`consumedElectricity.${idx}.dataSource`}
                                                    label="Nguồn dữ liệu"
                                                    options={DATA_SOURCE_OPTIONS}
                                                />
                                            </Box>
                                        </Stack>

                                        <IconButton
                                            aria-label="Xoá năm"
                                            onClick={() => remove(idx)}
                                            disabled={fields.length === 1 || mergedDisabled}
                                            color="error"
                                        >
                                            <DeleteOutlineIcon />
                                        </IconButton>
                                    </Stack>
                                </Box>

                                <Divider />

                                {/* ===== TABLE ===== */}
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ width: 140, fontWeight: 700 }}>Tháng</TableCell>
                                            <TableCell sx={{ fontWeight: 700 }}>Điện năng tiêu thụ (kWh)</TableCell>
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {Array.from({ length: 12 }, (_, i) => (
                                            <TableRow key={i}>
                                                <TableCell>Tháng {i + 1}</TableCell>
                                                <TableCell>
                                                    <RHFTextField
                                                        name={`consumedElectricity.${idx}.monthlyData.${i}.energyConsumption`}
                                                        type="number"
                                                        placeholder="kWh"
                                                        inputProps={{ min: 0 }}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Paper>
                        ))}
                    </Box>
                )}
                {tab === 1 && (
                    <Box sx={{ p: 2 }}>
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                                gap: 2,
                            }}
                        >
                            {(producedFields || []).map((f, idx) => (
                                <Paper key={f.id} variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
                                    {/* Header year + delete */}
                                    <Box sx={{ p: 2 }}>
                                        <Stack
                                            direction="row"
                                            alignItems="center"
                                            justifyContent="space-between"
                                            spacing={2}
                                        >
                                            <Box sx={{ minWidth: 180 }}>
                                                <RHFSelect
                                                    name={`producedElectricity.${idx}.year`}
                                                    label="Năm"
                                                    options={yearOptions}
                                                />
                                            </Box>

                                            <IconButton
                                                aria-label="Xoá năm"
                                                onClick={() => removeProduced(idx)}
                                                disabled={(producedFields?.length || 0) === 1}
                                            >
                                                <DeleteOutlineIcon />
                                            </IconButton>
                                        </Stack>

                                        <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                                            Chọn loại năng lượng để nhập thông tin tương ứng.
                                        </Typography>
                                    </Box>

                                    <Divider />

                                    {/* 3 cards select */}
                                    <Box sx={{ p: 2 }}>
                                        <Box
                                            sx={{
                                                display: 'grid',
                                                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' },
                                                gap: 2,
                                            }}
                                        >
                                            {/* Solar */}
                                            <Card
                                                variant="outlined"
                                                sx={{
                                                    borderRadius: 2,
                                                    minHeight: 20,
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    display: 'flex',
                                                }}
                                            >
                                                <RHFCheckbox
                                                    name={`producedElectricity.${idx}.solar.isSelected`}
                                                    label="Solar"
                                                    fontWeight={700}
                                                />
                                            </Card>

                                            {/* Wind */}
                                            <Card
                                                variant="outlined"
                                                sx={{
                                                    borderRadius: 2,
                                                    minHeight: 20,
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    display: 'flex',
                                                }}
                                            >
                                                <RHFCheckbox
                                                    name={`producedElectricity.${idx}.wind.isSelected`}
                                                    label="Wind"
                                                    fontWeight={700}
                                                />
                                            </Card>

                                            {/* Geothermal */}
                                            <Card
                                                variant="outlined"
                                                sx={{
                                                    borderRadius: 2,
                                                    minHeight: 20,
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    display: 'flex',
                                                }}
                                            >
                                                <RHFCheckbox
                                                    name={`producedElectricity.${idx}.geothermal.isSelected`}
                                                    label="Geothermal"
                                                    fontWeight={700}
                                                />
                                            </Card>
                                        </Box>

                                        {/* Detail cards: show if selected */}
                                        <Stack spacing={2} sx={{ mt: 2 }}>
                                            {/* SOLAR details */}
                                            {watch(`producedElectricity.${idx}.solar.isSelected`) && (
                                                <Paper variant="outlined" sx={{ borderRadius: 2, p: 2 }}>
                                                    <Typography fontWeight={700} sx={{ mb: 1 }}>
                                                        Solar – Thông tin hệ thống
                                                    </Typography>

                                                    <Box
                                                        sx={{
                                                            display: 'grid',
                                                            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                                                            gap: 2,
                                                        }}
                                                    >
                                                        <RHFTextField
                                                            name={`producedElectricity.${idx}.solar.installedArea`}
                                                            label="Diện tích lắp đặt (m²)"
                                                            type="number"
                                                            inputProps={{ min: 0 }}
                                                        />
                                                        <RHFTextField
                                                            name={`producedElectricity.${idx}.solar.installedCapacity`}
                                                            label="Công suất lắp đặt (kWp)"
                                                            type="number"
                                                            inputProps={{ min: 0 }}
                                                        />
                                                        <RHFTextField
                                                            name={`producedElectricity.${idx}.solar.averageEfficiency`}
                                                            label="Hiệu suất trung bình (%)"
                                                            type="number"
                                                            inputProps={{ min: 0 }}
                                                        />
                                                        <RHFTextField
                                                            name={`producedElectricity.${idx}.solar.averageSunHoursPerYear`}
                                                            label="Giờ nắng TB/năm"
                                                            type="number"
                                                            inputProps={{ min: 0 }}
                                                        />
                                                        <RHFTextField
                                                            name={`producedElectricity.${idx}.solar.systemLosses`}
                                                            label="Tổn thất hệ thống (%)"
                                                            type="number"
                                                            inputProps={{ min: 0 }}
                                                        />
                                                    </Box>
                                                </Paper>
                                            )}

                                            {/* WIND details */}
                                            {watch(`producedElectricity.${idx}.wind.isSelected`) && (
                                                <Paper variant="outlined" sx={{ borderRadius: 2, p: 2 }}>
                                                    <Typography fontWeight={700} sx={{ mb: 1 }}>
                                                        Wind – Thông tin hệ thống
                                                    </Typography>

                                                    <Box
                                                        sx={{
                                                            display: 'grid',
                                                            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                                                            gap: 2,
                                                        }}
                                                    >
                                                        <RHFTextField
                                                            name={`producedElectricity.${idx}.wind.turbineCount`}
                                                            label="Số turbine (cái)"
                                                            type="number"
                                                            inputProps={{ min: 0 }}
                                                        />
                                                        <RHFTextField
                                                            name={`producedElectricity.${idx}.wind.turbineCapacity`}
                                                            label="Công suất/turbine (kWp)"
                                                            type="number"
                                                            inputProps={{ min: 0 }}
                                                        />
                                                        <RHFTextField
                                                            name={`producedElectricity.${idx}.wind.averageWindSpeed`}
                                                            label="Tốc độ gió TB (m/s)"
                                                            type="number"
                                                            inputProps={{ min: 0 }}
                                                        />
                                                        <RHFTextField
                                                            name={`producedElectricity.${idx}.wind.operatingHoursPerYear`}
                                                            label="Giờ vận hành/năm"
                                                            type="number"
                                                            inputProps={{ min: 0 }}
                                                        />
                                                        <RHFTextField
                                                            name={`producedElectricity.${idx}.wind.capacityFactor`}
                                                            label="Hệ số công suất (%)"
                                                            type="number"
                                                            inputProps={{ min: 0 }}
                                                        />
                                                    </Box>
                                                </Paper>
                                            )}

                                            {/* GEOTHERMAL details */}
                                            {watch(`producedElectricity.${idx}.geothermal.isSelected`) && (
                                                <Paper variant="outlined" sx={{ borderRadius: 2, p: 2 }}>
                                                    <Typography fontWeight={700} sx={{ mb: 1 }}>
                                                        Geothermal – Thông tin hệ thống
                                                    </Typography>

                                                    <Box
                                                        sx={{
                                                            display: 'grid',
                                                            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                                                            gap: 2,
                                                        }}
                                                    >
                                                        <RHFTextField
                                                            name={`producedElectricity.${idx}.geothermal.installedCapacity`}
                                                            label="Công suất lắp đặt (kWp)"
                                                            type="number"
                                                            inputProps={{ min: 0 }}
                                                        />
                                                        <RHFTextField
                                                            name={`producedElectricity.${idx}.geothermal.sourceTemperature`}
                                                            label="Nhiệt độ nguồn (°C)"
                                                            type="number"
                                                        />
                                                        <RHFTextField
                                                            name={`producedElectricity.${idx}.geothermal.operatingHoursPerYear`}
                                                            label="Giờ vận hành/năm"
                                                            type="number"
                                                            inputProps={{ min: 0 }}
                                                        />
                                                        <RHFTextField
                                                            name={`producedElectricity.${idx}.geothermal.systemCOP`}
                                                            label="COP hệ thống"
                                                            type="number"
                                                            inputProps={{ min: 0 }}
                                                        />
                                                    </Box>
                                                </Paper>
                                            )}
                                        </Stack>
                                    </Box>
                                </Paper>
                            ))}
                        </Box>
                    </Box>
                )}
            </Paper>
        </Stack>
    );
}
