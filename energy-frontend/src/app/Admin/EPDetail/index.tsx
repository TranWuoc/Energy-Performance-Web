import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import {
    Box,
    Button,
    Chip,
    Divider,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Tooltip,
    Typography,
} from '@mui/material';
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BUILDING_TYPE_LABEL, DATA_SOURCE_LABEL, EP_INPUT_META, EP_NORMALISED_META } from '../../../constants';
import { formatNumber } from '../../../utils/ep';
import { useBuildingDetail } from '../Buildings/hooks/useBuildings';
import { useEPDetail } from '../EnergyPerformance/hooks/useEPList';
import { buildEPInputsFromBuilding } from './helper/EPInputsBuilding';

function renderValueWithUnit(value: any, unit?: string) {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'number') {
        return `${formatNumber(value)}${unit ? ` ${unit}` : ''}`;
    }
    return String(value);
}

function KeyValueTable({
    title,
    meta,
    data,
}: {
    title: string;
    meta: Record<string, { label: string; unit?: string; formula?: string; formatter?: (v: any) => string }>;
    data: Record<string, any> | undefined;
}) {
    return (
        <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                {title}
            </Typography>

            <Table size="small">
                <TableBody>
                    {Object.entries(meta).map(([key, m]) => {
                        const value = data?.[key];

                        return (
                            <TableRow key={key}>
                                <TableCell sx={{ width: 340, fontWeight: 700 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <span>{m.label}</span>

                                        {m.formula && (
                                            <Tooltip title={m.formula} arrow>
                                                <InfoOutlineIcon
                                                    sx={{ fontSize: 16, color: 'text.secondary', cursor: 'help' }}
                                                />
                                            </Tooltip>
                                        )}
                                    </Box>
                                </TableCell>

                                <TableCell>
                                    {m.formatter ? m.formatter(value) : renderValueWithUnit(value, m.unit)}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </Paper>
    );
}

export default function EPDetailPage() {
    const navigate = useNavigate();
    const { buildingId } = useParams();

    const { data: EP, isLoading, isError } = useEPDetail(buildingId);

    const epRecord = EP?.data?.[0];

    const year = epRecord?.year;

    const { data: buildingDetail } = useBuildingDetail(buildingId);
    const inputs = useMemo(() => {
        if (!year) {
            return {
                GFA: 0,
                CPA: 0,
                DCA: 0,
                GLA: 0,
                VA: 0,
                EC: 0,
                RE: 0,
                dataSource: null as 1 | 2 | null,
            };
        }
        return buildEPInputsFromBuilding(buildingDetail, year);
    }, [buildingDetail, year]);

    const occ = epRecord?.inputs.FVR ?? 0;
    const isLowOcc = occ < 0.7;

    if (isLoading) {
        return <Typography>Đang tải...</Typography>;
    }

    if (isError || !epRecord) {
        return (
            <Box>
                <Typography sx={{ fontWeight: 700, mb: 1 }}>Không tìm thấy dữ liệu EP</Typography>
                <Button variant="outlined" onClick={() => navigate(-1)}>
                    Quay lại
                </Button>
            </Box>
        );
    }

    const buildingTypeLabel = BUILDING_TYPE_LABEL[epRecord.buildingType as 1 | 2] ?? epRecord.buildingType;
    const dataSourceLabel = epRecord.inputs?.dataSource ? DATA_SOURCE_LABEL[epRecord.inputs.dataSource] : '-';

    return (
        <Box sx={{ display: 'grid', gap: 2 }}>
            {/* Header */}
            <Paper variant="outlined" sx={{ p: 2 }}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 2,
                        flexWrap: 'wrap',
                    }}
                >
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 800 }}>
                            {epRecord.buildingName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Building ID: {epRecord.buildingId}
                        </Typography>
                    </Box>

                    <Button variant="outlined" onClick={() => navigate(-1)}>
                        Quay lại
                    </Button>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1.5 }}>
                    <Chip label={`Năm: ${epRecord.year}`} variant="outlined" />
                    <Chip label={`Kiểu: ${buildingTypeLabel}`} variant="outlined" />
                    <Chip
                        label={`Occupancy: ${(occ * 100).toFixed(2)}%`}
                        color={isLowOcc ? 'error' : 'success'}
                        variant="outlined"
                        sx={{ fontWeight: 700 }}
                    />

                    {isLowOcc && <Chip label="Cảnh báo: Tỷ lệ sử dụng < 70%" color="error" sx={{ fontWeight: 700 }} />}
                </Box>
            </Paper>

            {/* EP big number */}
            <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                    Chỉ số EP
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 900, mt: 0.5 }}>
                    {typeof epRecord.ep === 'number' ? epRecord.ep.toFixed(2) : '-'}
                </Typography>

                <Divider sx={{ my: 1.5 }} />

                <Typography variant="body2" color="text.secondary">
                    Nguồn dữ liệu (Data source): <b>{dataSourceLabel}</b>
                </Typography>
            </Paper>

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
                    gap: 2,
                }}
            >
                <KeyValueTable title="Dữ liệu thu thập" meta={EP_INPUT_META} data={inputs} />
                <KeyValueTable title="Dữ liệu chuẩn hoá" meta={EP_NORMALISED_META} data={epRecord.normalised} />
            </Box>
        </Box>
    );
}
