import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Typography,
} from '@mui/material';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { type UtilisationLevel } from '../../../api/buildings/building.type';
import { BUILDING_TYPE_LABEL } from '../../../constants';
import { convertTechnicalSystems } from '../../../utils/technicalSystem';
import { toastError, toastSuccess } from '../../../utils/toast';
import { useBuildingDetail, useExportBuildings } from '../Buildings/hooks/useBuildings';
import ConfirmDialog from '../Components/ConfirmDialog';
import ConsumedElectricitySection from './Sections/ConsumedElectricitySection';
import ProducedElectricitySection from './Sections/ProducedElectricitySection';
import { getZoneLabel } from './helper';

function formatDateTime(iso: string) {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '-';
    return d.toLocaleString('vi-VN');
}

function KeyValueTable({ rows }: { rows: Array<{ k: string; v: any }> }) {
    return (
        <TableContainer component={Paper} variant="outlined">
            <Table size="small">
                <TableBody>
                    {rows.map((r) => (
                        <TableRow key={r.k}>
                            <TableCell sx={{ width: 280, fontWeight: 700 }}>{r.k}</TableCell>
                            <TableCell>{r.v === null || r.v === undefined || r.v === '' ? '-' : String(r.v)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

const UTILISATION_CHIP_STYLE: Record<UtilisationLevel, { bg: string; color: string }> = {
    Thấp: {
        bg: '#E3F2FD', // xanh nhạt
        color: '#1565C0',
    },
    'Trung bình': {
        bg: '#FFF8E1', // vàng nhạt
        color: '#EF6C00',
    },
    Cao: {
        bg: '#FDECEA', // đỏ nhạt
        color: '#C62828',
    },
};

export default function BuildingDetailPage() {
    const { buildingId } = useParams<{ buildingId: string }>();
    const [openExportConfirm, setOpenExportConfirm] = useState(false);

    const { mutateAsync: exportAsync, isPending: isExporting } = useExportBuildings();
    const { data, isLoading, isError } = useBuildingDetail(buildingId);

    if (isLoading) return <Box sx={{ p: 3 }}>Đang tải...</Box>;
    if (isError || !data) return <Box sx={{ p: 3 }}>Không tải được dữ liệu.</Box>;

    const gi = data.generalInfo ?? {};
    const technicalSystems = convertTechnicalSystems(gi);
    const buildingType = (data?.generalInfo.buildingType ?? 1) as 1 | 2;

    const isGovernment = data.generalInfo.buildingType === 1;

    const zones = isGovernment ? (data.operation?.governmentZones ?? []) : (data.operation?.commercialZones ?? []);
    const consumed = data.consumedElectricity ?? [];
    const produced = data.producedElectricity ?? [];

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
                {gi.name ?? 'Building Detail'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                BuildingId: {data.buildingId} • Tạo lúc: {formatDateTime(data.createdAt ?? '')}
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button variant="contained" onClick={() => setOpenExportConfirm(true)} disabled={!buildingId}>
                    Xuất dữ liệu
                </Button>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                Thông tin người tạo
            </Typography>
            <KeyValueTable
                rows={[
                    { k: 'Họ và tên', v: data.user?.fullName },
                    { k: 'Email', v: data.user?.email },
                    { k: 'Số điện thoại', v: data.user?.phone },
                ]}
            />

            <Divider sx={{ mb: 2, mt: 4 }} />

            {/* GENERAL INFO */}
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                Thông tin chung
            </Typography>
            <KeyValueTable
                rows={[
                    { k: 'Tên toà nhà', v: gi.name },
                    { k: 'Địa chỉ', v: gi.address },
                    { k: 'Chủ sở hữu', v: gi.owner },
                    { k: 'Kiểu toà nhà', v: BUILDING_TYPE_LABEL[gi.buildingType as 1 | 2] },
                    { k: 'Năm đưa vào vận hành', v: gi.commissioningYear },
                    { k: 'Hệ thống kỹ thuật', v: technicalSystems.length ? technicalSystems.join(', ') : '-' },
                    // { k: 'Khu vực', v: gi.climateZone },
                    { k: 'Tổng diện tích (m²)', v: gi.totalFloorArea },
                    { k: 'Diện tích trên mặt đất (m²)', v: gi.aboveGroundFloorArea },
                    { k: 'Diện tích tầng hầm (m²)', v: gi.basementFloorArea },
                    { k: 'Diện tích data centre (m²)', v: gi.dataCenterArea },
                    { k: 'Bãi xe ngoài trời (m²)', v: gi.outdoorParkingArea },
                    { k: 'Bãi xe trong nhà (m²)', v: gi.indoorParkingArea },
                    { k: 'Tổng diện tích cho thuê (m²)', v: gi.totalRentableArea },
                    { k: 'Diện tích không cho thuê (m²)', v: gi.nonRentableArea },
                    { k: 'Diện tích khu vực người thuê không có người thuê (m²)', v: gi.vacantArea },
                    { k: 'Loại kiểm soát hệ thống toà nhà', v: gi.controlSystemType },
                    { k: 'Other systems', v: gi.otherSystems },
                    { k: 'Thông số cài đặt nhiệt độ (°C)', v: gi.setpointTemperature },
                    { k: 'Thông số cài đặt độ ẩm (%)', v: gi.setpointHumidity },
                    { k: 'Thông số cài đặt chiếu sáng (lx)', v: gi.setpointLightingLevel },
                ]}
            />

            <Divider sx={{ my: 3 }} />

            {/* OPERATION */}
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                Vận hành (Operation)
            </Typography>

            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 2,
                }}
            >
                {zones.map((z: any, idx: number) => {
                    const label = getZoneLabel(buildingType, z.zoneCode);
                    const level = z.utilisationLevel;

                    return (
                        <Card
                            key={`${z.zoneCode}-${idx}`}
                            variant="outlined"
                            sx={{
                                width: 320,
                                minHeight: 260,
                                flexShrink: 0,
                            }}
                        >
                            <CardContent>
                                {/* HEADER */}
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                                    <Typography sx={{ fontWeight: 800 }}>{label}</Typography>

                                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                                        {'isRented' in z && (
                                            <Chip
                                                size="small"
                                                color={z.isRented ? 'success' : 'default'}
                                                label={z.isRented ? 'Đang thuê' : 'Không thuê'}
                                            />
                                        )}

                                        {level && (
                                            <Chip
                                                size="small"
                                                label={level}
                                                sx={{
                                                    backgroundColor:
                                                        UTILISATION_CHIP_STYLE[level as UtilisationLevel].bg,
                                                    color: UTILISATION_CHIP_STYLE[level as UtilisationLevel].color,
                                                    fontWeight: 600,
                                                }}
                                            />
                                        )}
                                    </Box>
                                </Box>

                                <Divider sx={{ my: 1.2 }} />

                                {/* LỊCH */}
                                <Typography variant="subtitle2" fontWeight={700}>
                                    Lịch vận hành
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Weekday: {z.weekday?.from ?? '--:--'} → {z.weekday?.to ?? '--:--'} <br />
                                    Saturday: {z.saturday?.from ?? '--:--'} → {z.saturday?.to ?? '--:--'} <br />
                                    Sunday: {z.sunday?.from ?? '--:--'} → {z.sunday?.to ?? '--:--'}
                                </Typography>

                                <Divider sx={{ my: 1.2 }} />

                                {/* INFO */}
                                <Typography variant="subtitle2" fontWeight={700}>
                                    Thông tin sử dụng
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Số người trung bình: {z.averagePeople ?? '-'} <br />
                                    {'rentableArea' in z && z.rentableArea != null && (
                                        <>
                                            Diện tích thuê: {z.rentableArea.toLocaleString()} m²
                                            <br />
                                        </>
                                    )}
                                    Ghi chú: {z.note ?? '-'}
                                </Typography>
                            </CardContent>
                        </Card>
                    );
                })}
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* CONSUMED ELECTRICITY */}
            <ConsumedElectricitySection consumed={consumed} />

            <Divider sx={{ my: 3 }} />

            {/* PRODUCED ELECTRICITY */}
            <ProducedElectricitySection produced={produced} />
            <ConfirmDialog
                open={openExportConfirm}
                title="Xác nhận xuất dữ liệu"
                description="Bạn có chắc chắn muốn xuất dữ liệu của toà nhà này không?"
                loading={isExporting}
                onCancel={() => {
                    if (isExporting) return;
                    setOpenExportConfirm(false);
                }}
                onConfirm={async () => {
                    if (!buildingId) return;

                    try {
                        await exportAsync([buildingId]);
                        setOpenExportConfirm(false);
                        toastSuccess('Xuất bản ghi thành công');
                    } catch {
                        toastError('Xuất bản ghi không thành công');
                    }
                }}
                confirmText="Xác nhận"
            />
        </Box>
    );
}
