import {
    Box,
    Chip,
    Divider,
    MenuItem,
    Paper,
    Select,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';

import AirIcon from '@mui/icons-material/Air';
import ApartmentIcon from '@mui/icons-material/Apartment';
import BoltIcon from '@mui/icons-material/Bolt';
import MapsHomeWorkIcon from '@mui/icons-material/MapsHomeWork';
import SolarPowerIcon from '@mui/icons-material/SolarPower';
import { useMemo, useState } from 'react';
import type { Building } from '../../../api/buildings/building.type';
import { useBuildings } from '../Buildings/hooks/useBuildings';
import { useEPList } from '../EnergyPerformance/hooks/useEPList';
import type { EPRecord } from '../EnergyPerformance/Types/ep.type';
import MiniDonut from './Components/MiniDonut';
import StatCard from './Components/StatCard';
import { extractEPArray, hasAnyRenewable, pickEPValue, safeNumber, sumAnnualConsumptionForYear } from './helper';

export default function DashboardPage() {
    const { data: buildingsRes, isLoading: loadingBuildings, isError: buildingError } = useBuildings();
    const { data: epRes, isLoading: loadingEP, isError: epError } = useEPList();

    const buildings: Building[] = buildingsRes?.data || [];
    const epList: EPRecord[] = extractEPArray(epRes);

    const loading = loadingBuildings || loadingEP;

    // Filters
    const [q, setQ] = useState('');
    const [type, setType] = useState<'all' | '1' | '2'>('all');
    const [yearMode, setYearMode] = useState<'latest' | number>('latest');

    const yearOptions = useMemo(() => {
        const set = new Set<number>();

        buildings.forEach((b) => (b.consumedElectricity || []).forEach((y) => set.add(Number(y.year))));
        epList.forEach((r) => set.add(Number(r.year)));

        return Array.from(set).sort((a, b) => b - a);
    }, [buildings, epList]);

    const selectedYear = useMemo(() => {
        if (yearMode === 'latest') return yearOptions[0] ?? new Date().getFullYear();
        return yearMode;
    }, [yearMode, yearOptions]);

    const filteredBuildings = useMemo(() => {
        const kw = q.trim().toLowerCase();

        return buildings.filter((b) => {
            const matchesType = type === 'all' ? true : String(b.generalInfo.buildingType) === type;
            const matchesQ =
                kw.length === 0
                    ? true
                    : `${b.generalInfo.name} ${b.generalInfo.address} ${b.buildingId}`.toLowerCase().includes(kw);

            return matchesType && matchesQ;
        });
    }, [buildings, q, type]);

    const latestEPByBuilding = useMemo(() => {
        const map = new Map<string, EPRecord>();

        epList.forEach((row) => {
            const cur = map.get(row.buildingId);
            if (!cur || Number(row.year) > Number(cur.year)) map.set(row.buildingId, row);
        });

        return map;
    }, [epList]);

    const kpis = useMemo(() => {
        const totalBuildings = buildings.length;

        const gov = buildings.filter((b) => b.generalInfo.buildingType === 1).length;
        const com = buildings.filter((b) => b.generalInfo.buildingType === 2).length;

        const renewableCount = buildings.filter((b) => hasAnyRenewable(b)).length;
        const renewablePct = totalBuildings === 0 ? 0 : Math.round((renewableCount / totalBuildings) * 100);

        // EP avg using latest EP per building
        const latest = Array.from(latestEPByBuilding.values());
        const valid = latest.map((r) => pickEPValue(r)).filter((x) => typeof x === 'number') as number[];
        const avgEP = valid.length === 0 ? 0 : valid.reduce((s, n) => s + n, 0) / valid.length;

        // total annual consumption for selectedYear
        const totalAnnualKwh = buildings.reduce((sum, b) => sum + sumAnnualConsumptionForYear(b, selectedYear), 0);

        return {
            totalBuildings,
            gov,
            com,
            renewablePct,
            avgEP,
            totalAnnualKwh,
        };
    }, [buildings, latestEPByBuilding, selectedYear]);

    const monthTotals = useMemo(() => {
        const totals = Array.from({ length: 12 }).map((_, idx) => {
            const month = idx + 1;
            const sum = buildings.reduce((s, b) => {
                const row = (b.consumedElectricity || []).find((x) => Number(x.year) === Number(selectedYear));
                const mRow = row?.monthlyData?.find((x) => Number(x.month) === month);
                return s + safeNumber(mRow?.energyConsumption);
            }, 0);

            return sum;
        });

        return totals;
    }, [buildings, selectedYear]);

    const tableRows = useMemo(() => {
        const rows = filteredBuildings.map((b) => {
            const ep = latestEPByBuilding.get(b.buildingId);
            return {
                buildingId: b.buildingId,
                name: b.generalInfo.name,
                type: b.generalInfo.buildingType,
                climateZone: b.generalInfo.climateZone || ep?.climateZone || '-',
                latestYear: ep?.year ?? null,
                ep: ep ? pickEPValue(ep) : null,
                woh: ep?.normalised?.WOH ?? null,
                awh: ep?.normalised?.AWH ?? null,
                renewable: hasAnyRenewable(b),
                hasSolar: (b.producedElectricity || []).some((y) => y.solar?.isSelected),
                hasWind: (b.producedElectricity || []).some((y) => y.wind?.isSelected),
                hasGeo: (b.producedElectricity || []).some((y) => y.geothermal?.isSelected),
            };
        });

        rows.sort((a, b) => safeNumber(b.ep, -1) - safeNumber(a.ep, -1));
        return rows;
    }, [filteredBuildings, latestEPByBuilding]);

    const maxMonth = useMemo(() => Math.max(...monthTotals, 1), [monthTotals]);

    return (
        <Box>
            {/* Header */}
            <Stack
                direction={{ xs: 'column', md: 'row' }}
                alignItems={{ xs: 'flex-start', md: 'center' }}
                justifyContent="space-between"
                spacing={1.5}
                sx={{ mb: 2 }}
            >
                <Box>
                    <Typography fontWeight={950} fontSize={22}>
                        Dashboard
                    </Typography>
                    {(buildingError || epError) && (
                        <Typography variant="body2" sx={{ mt: 0.5, color: 'error.main', fontWeight: 900 }}>
                            Không tải được dữ liệu. Kiểm tra BE hoặc token/endpoint.
                        </Typography>
                    )}
                </Box>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ xs: 'stretch', sm: 'center' }}>
                    <TextField
                        size="small"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Tìm theo tên / địa chỉ / buildingId…"
                        sx={{ minWidth: { xs: '100%', sm: 320 } }}
                    />

                    <Select
                        size="small"
                        value={type}
                        onChange={(e) => setType(e.target.value as any)}
                        sx={{ minWidth: 220 }}
                    >
                        <MenuItem value="all">Tất cả loại tòa nhà</MenuItem>
                        <MenuItem value="1">Văn phòng công sở nhà nước</MenuItem>
                        <MenuItem value="2">Văn phòng thương mại</MenuItem>
                    </Select>

                    <Select
                        size="small"
                        value={yearMode === 'latest' ? 'latest' : String(yearMode)}
                        onChange={(e) => {
                            const v = e.target.value;
                            if (v === 'latest') return setYearMode('latest');
                            setYearMode(Number(v));
                        }}
                        sx={{ minWidth: 150 }}
                    >
                        <MenuItem value="latest">Năm mới nhất</MenuItem>
                        {yearOptions.map((y) => (
                            <MenuItem key={y} value={String(y)}>
                                {y}
                            </MenuItem>
                        ))}
                    </Select>
                </Stack>
            </Stack>

            {/* KPI */}
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' },
                    gap: 2,
                    mb: 2,
                }}
            >
                <StatCard
                    title="Tổng số tòa nhà"
                    value={loading ? '—' : String(kpis.totalBuildings)}
                    hint="Tổng số toà nhà đã khảo sát từ hệ thống"
                    rightChip={`Year: ${selectedYear}`}
                    icon={<ApartmentIcon fontSize="small" />}
                    morePath="/admin/buildings"
                    bgicon="#54ff6b"
                />

                <StatCard
                    title="EP trung bình (latest)"
                    value={loading ? '—' : (kpis.avgEP || 0).toFixed(2)}
                    hint="Tính theo EP record mới nhất của mỗi tòa nhà"
                    rightChip="EP"
                    icon={<BoltIcon fontSize="small" />}
                    morePath="/admin/energy-performance"
                    bgicon="#ffd700"
                />

                <StatCard
                    title={`Tổng điện tiêu thụ (${selectedYear})`}
                    value={loading ? '—' : `${Math.round(kpis.totalAnnualKwh).toLocaleString()} kWh`}
                    hint="Cộng tổng điện năng tiêu thụ của tất cả tòa nhà theo năm đang chọn"
                    rightChip="TBEC"
                    icon={<BoltIcon fontSize="small" />}
                    bgicon="#ffd700"
                />
            </Box>

            {/* Mid Grid */}
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
                    gap: 2,
                    mb: 2,
                }}
            >
                {/* Monthly chart */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 2.25,
                        borderRadius: 3,
                        border: '1px solid rgba(0,0,0,0.06)',
                        bgcolor: 'white',
                    }}
                >
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Box>
                            <Typography fontWeight={950}>Điện tiêu thụ theo tháng</Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 900 }}>
                                Tổng hợp theo năm {selectedYear} (kWh)
                            </Typography>
                        </Box>
                        <Chip size="small" label="Monthly" sx={{ bgcolor: 'rgba(0,0,0,0.05)', fontWeight: 900 }} />
                    </Stack>

                    <Box
                        sx={{
                            mt: 3,
                            display: 'grid',
                            gridTemplateColumns: { xs: 'repeat(6, 1fr)', md: 'repeat(12, 1fr)' },
                            gap: 1.6,
                            alignItems: 'end',
                            height: 190,
                        }}
                    >
                        {monthTotals.map((val, idx) => {
                            const h = Math.max(8, Math.round((val / maxMonth) * 150));
                            return (
                                <Box key={idx} sx={{ display: 'grid', gap: 1 }}>
                                    <Tooltip title={`${val.toLocaleString()} kWh`} arrow>
                                        <Box
                                            sx={{
                                                width: '100%',
                                                height: h,
                                                borderRadius: 2,
                                                bgcolor: '#95cadc',
                                                border: '1px solid rgba(0,0,0,0.06)',
                                            }}
                                        />
                                    </Tooltip>
                                    <Typography
                                        variant="caption"
                                        sx={{ color: 'text.secondary', fontWeight: 900, textAlign: 'center' }}
                                    >
                                        {idx + 1}
                                    </Typography>
                                </Box>
                            );
                        })}
                    </Box>
                </Paper>

                {/* Breakdown */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 2.25,
                        borderRadius: 3,
                        border: '1px solid rgba(0,0,0,0.06)',
                        bgcolor: 'white',
                    }}
                >
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Typography fontWeight={950}>Tổng quan nhanh</Typography>
                    </Stack>

                    <Stack spacing={2} sx={{ mt: 2 }}>
                        <Paper elevation={0} sx={{ p: 2, borderRadius: 3, bgcolor: 'rgba(0,0,0,0.04)' }}>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <MiniDonut
                                    percent={
                                        kpis.totalBuildings ? Math.round((kpis.gov / kpis.totalBuildings) * 100) : 0
                                    }
                                />
                                <Box>
                                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 900 }}>
                                        Tỷ lệ văn phòng nhà nước
                                    </Typography>
                                    <Typography fontWeight={950} fontSize={20}>
                                        {kpis.gov} / {kpis.totalBuildings}
                                    </Typography>
                                </Box>
                            </Stack>
                        </Paper>

                        <Paper elevation={0} sx={{ p: 2, borderRadius: 3, bgcolor: 'rgba(0,0,0,0.04)' }}>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <MiniDonut percent={kpis.renewablePct} />
                                <Box>
                                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 900 }}>
                                        Tòa nhà có năng lượng tái tạo
                                    </Typography>
                                    <Typography fontWeight={950} fontSize={20}>
                                        {kpis.renewablePct}%
                                    </Typography>
                                </Box>
                            </Stack>
                        </Paper>

                        <Divider />

                        <Stack spacing={2}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Typography fontWeight={950} fontSize={13} color="red">
                                    Toà nhà có sự cố
                                </Typography>
                                <Chip
                                    size="small"
                                    label={`Tổng cộng: ${filteredBuildings.length}`}
                                    sx={{ fontWeight: 900 }}
                                />
                            </Stack>

                            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                <Chip
                                    size="small"
                                    label={`Văn phòng nhà nước: ${kpis.gov}`}
                                    sx={{ fontWeight: 900 }}
                                    color="error"
                                />
                                <Chip
                                    size="small"
                                    label={`Văn phòng thuơng mại: ${kpis.com}`}
                                    sx={{ fontWeight: 900 }}
                                    color="error"
                                />
                            </Stack>
                        </Stack>
                    </Stack>
                </Paper>
            </Box>

            {/* Table */}
            <Paper
                elevation={0}
                sx={{
                    p: 2.25,
                    borderRadius: 3,
                    border: '1px solid rgba(0,0,0,0.06)',
                    bgcolor: 'white',
                }}
            >
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography fontWeight={950}>Thông tin hiệu suất điện năng mới nhất </Typography>
                    <Chip size="small" label="EP" sx={{ bgcolor: 'rgba(0,0,0,0.05)', fontWeight: 900 }} />
                </Stack>

                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 950 }} align="left">
                                Toà nhà
                            </TableCell>
                            <TableCell sx={{ fontWeight: 950 }} align="center">
                                Loại toà nhà
                            </TableCell>
                            <TableCell sx={{ fontWeight: 950 }} align="center">
                                Chỉ số năng lượng gần đây nhất
                            </TableCell>
                            <TableCell sx={{ fontWeight: 950 }} align="center">
                                Giờ vận hành tiêu chuẩn
                            </TableCell>
                            <TableCell sx={{ fontWeight: 950 }} align="center">
                                Giờ vận hành thực tế
                            </TableCell>
                            <TableCell sx={{ fontWeight: 950 }} align="right">
                                Renewables
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={8} sx={{ py: 3 }}>
                                    <Typography sx={{ color: 'text.secondary', fontWeight: 900 }}>
                                        Đang tải dữ liệu…
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : tableRows.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} sx={{ py: 3 }}>
                                    <Typography sx={{ color: 'text.secondary', fontWeight: 900 }}>
                                        Không có dữ liệu phù hợp filter.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            tableRows.map((row) => (
                                <TableRow key={row.buildingId} hover>
                                    <TableCell>
                                        <Stack direction="row" spacing={1.2} alignItems="center">
                                            <MapsHomeWorkIcon />
                                            <Box>
                                                <Typography fontWeight={950} fontSize={13}>
                                                    {row.name}
                                                </Typography>
                                                <Typography
                                                    variant="caption"
                                                    sx={{ color: 'text.secondary', fontWeight: 800 }}
                                                >
                                                    {row.buildingId}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </TableCell>

                                    <TableCell sx={{ fontWeight: 900 }} align="center">
                                        {row.type === 1 ? 'Nhà nước' : 'Thương mại'}
                                    </TableCell>

                                    <TableCell sx={{ fontWeight: 950 }} align="center">
                                        {row.ep == null ? '—' : Number(row.ep).toFixed(2)}
                                    </TableCell>

                                    <TableCell sx={{ fontWeight: 900 }} align="center">
                                        {row.woh == null ? '—' : Math.round(Number(row.woh))}
                                    </TableCell>

                                    <TableCell sx={{ fontWeight: 900 }} align="center">
                                        {row.awh == null ? '—' : Math.round(Number(row.awh))}
                                    </TableCell>

                                    <TableCell align="right">
                                        {row.renewable ? (
                                            <Stack
                                                direction="row"
                                                spacing={0.8}
                                                justifyContent="flex-end"
                                                flexWrap="wrap"
                                                useFlexGap
                                            >
                                                {row.hasSolar ? (
                                                    <Chip
                                                        size="small"
                                                        icon={<SolarPowerIcon />}
                                                        label="Solar"
                                                        sx={{ fontWeight: 900 }}
                                                    />
                                                ) : null}
                                                {row.hasWind ? (
                                                    <Chip
                                                        size="small"
                                                        icon={<AirIcon />}
                                                        label="Wind"
                                                        sx={{ fontWeight: 900 }}
                                                    />
                                                ) : null}
                                                {row.hasGeo ? (
                                                    <Chip size="small" label="Geo" sx={{ fontWeight: 900 }} />
                                                ) : null}
                                            </Stack>
                                        ) : (
                                            <Chip
                                                size="small"
                                                label="None"
                                                sx={{ fontWeight: 900, bgcolor: 'rgba(0,0,0,0.05)' }}
                                            />
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Paper>
        </Box>
    );
}
