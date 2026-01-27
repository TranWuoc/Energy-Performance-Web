import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import { Box, Chip, Divider, Paper, Table, TableBody, TableCell, TableRow, Tooltip, Typography } from '@mui/material';
import { formatNumber } from '../../../../utils/ep';
import { useEPDetail } from '../../../Admin/EnergyPerformance/hooks/useEPList';
import { useBuildingDetail } from '../../hooks/useBuilding';
import { buildEPInputsFromBuilding } from '../../../Admin/EPDetail/helper/EPInputsBuilding';
import { BUILDING_TYPE_LABEL, DATA_SOURCE_LABEL, EP_INPUT_META, EP_NORMALISED_META } from '../../../../constants';

type Props = {
    buildingId?: string;
};

function renderValueWithUnit(value: unknown, unit?: string) {
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
    meta: Record<string, { label: string; unit?: string; formula?: string; formatter?: (v: unknown) => string }>;
    data: Record<string, unknown> | undefined;
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

export default function EPStep({ buildingId }: Props) {
    const { data: EP, isLoading, isError } = useEPDetail(buildingId);
    const { data: buildingDetail } = useBuildingDetail(buildingId ?? '', Boolean(buildingId));

    if (!buildingId) {
        return (
            <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography sx={{ fontWeight: 800 }}>Thiếu buildingId</Typography>
                <Typography variant="body2" color="text.secondary">
                    Không thể tải chỉ số EP khi không có buildingId.
                </Typography>
            </Paper>
        );
    }

    if (isLoading) {
        return <Typography color="text.secondary">Đang tải dữ liệu EP...</Typography>;
    }

    if (isError || !EP || !Array.isArray(EP.data) || EP.data.length === 0) {
        return (
            <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography sx={{ fontWeight: 800, mb: 0.5 }}>Không tìm thấy dữ liệu EP</Typography>
                <Typography variant="body2" color="text.secondary">
                    Toà nhà này chưa có bản ghi EP hoặc chưa tính toán.
                </Typography>
            </Paper>
        );
    }

    return (
        <Box sx={{ display: 'grid', gap: 2 }}>
            {EP.data.map((epRecord, idx) => {
                const year = epRecord?.year;
                const inputs = year
                    ? buildEPInputsFromBuilding(buildingDetail, year)
                    : {
                          GFA: 0,
                          CPA: 0,
                          DCA: 0,
                          GLA: 0,
                          VA: 0,
                          EC: 0,
                          RE: 0,
                          dataSource: 1,
                      };

                const occ = epRecord?.inputs?.FVR ?? 0;
                const isLowOcc = occ < 0.7;
                const buildingTypeLabel =
                    BUILDING_TYPE_LABEL[epRecord?.buildingType as 1 | 2] ?? epRecord?.buildingType;
                const dataSourceLabel = epRecord?.inputs?.dataSource
                    ? DATA_SOURCE_LABEL[epRecord?.inputs.dataSource]
                    : '-';

                return (
                    <Paper key={year ?? idx} variant="outlined" sx={{ p: 2, mb: 2 }}>
                        <Typography variant="h5" sx={{ fontWeight: 800 }}>
                            {epRecord?.buildingName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Building ID: {epRecord?.buildingId}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1.5 }}>
                            <Chip label={`Năm: ${epRecord?.year}`} variant="outlined" />
                            <Chip label={`Kiểu: ${buildingTypeLabel}`} variant="outlined" />
                            <Chip
                                label={`Occupancy: ${(occ * 100).toFixed(2)}%`}
                                color={isLowOcc ? 'error' : 'success'}
                                variant="outlined"
                                sx={{ fontWeight: 700 }}
                            />
                            {isLowOcc && (
                                <Chip label="Cảnh báo: Tỷ lệ sử dụng < 70%" color="error" sx={{ fontWeight: 700 }} />
                            )}
                        </Box>
                        <Divider sx={{ my: 1.5 }} />
                        <Typography variant="subtitle2" color="text.secondary">
                            Chỉ số EP
                        </Typography>
                        <Typography variant="h3" sx={{ fontWeight: 900, mt: 0.5 }}>
                            {typeof epRecord?.ep === 'number' ? epRecord?.ep.toFixed(2) : '-'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Nguồn dữ liệu (Data source): <b>{dataSourceLabel}</b>
                        </Typography>
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
                                gap: 2,
                                mt: 2,
                            }}
                        >
                            <KeyValueTable title="Dữ liệu thu thập" meta={EP_INPUT_META} data={inputs} />
                            <KeyValueTable
                                title="Dữ liệu chuẩn hoá"
                                meta={EP_NORMALISED_META}
                                data={epRecord?.normalised ? { ...epRecord.normalised } : undefined}
                            />
                        </Box>
                    </Paper>
                );
            })}
        </Box>
    );
}
