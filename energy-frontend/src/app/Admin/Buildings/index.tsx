import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
    Box,
    Button,
    Checkbox,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Building } from '../../../api/buildings/building.type';
import { BUILDING_TYPE_LABEL } from '../../../constants';
import { toastError, toastSuccess } from '../../../utils/toast';
import { default as ConfirmDialog } from '../Components/ConfirmDialog';
import { useBuildings, useDeleteBuilding, useExportBuildings } from './hooks/useBuildings';

type DeleteTarget = { buildingId: string; name?: string } | null;

function formatDateTime(iso: string) {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString();
}

export default function BuildingsPageAdmin() {
    const navigate = useNavigate();
    const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [openExportConfirm, setOpenExportConfirm] = useState(false);

    const { mutateAsync: exportAsync, isPending: isExporting } = useExportBuildings();
    const { data, isLoading, isError } = useBuildings();
    const { mutate: onDelete, isPending } = useDeleteBuilding();

    // Filters
    const [keyword, setKeyword] = useState('');
    const [buildingType, setBuildingType] = useState<number | 'all'>('all');
    const [climateZone, setClimateZone] = useState<string | 'all'>('all');
    const [yearFrom, setYearFrom] = useState<string>('');
    const [yearTo, setYearTo] = useState<string>('');

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const rows: Building[] = useMemo(() => {
        const list = data?.data ?? [];

        return [...list].sort((a, b) => {
            const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return timeB - timeA;
        });
    }, [data]);

    const climateZoneOptions = useMemo(() => {
        const set = new Set<string>();
        rows.forEach((b) => {
            const cz = b.generalInfo?.climateZone;
            if (cz) set.add(cz);
        });
        return Array.from(set).sort();
    }, [rows]);

    const filteredRows = useMemo(() => {
        const kw = keyword.trim().toLowerCase();
        const yFrom = yearFrom ? Number(yearFrom) : undefined;
        const yTo = yearTo ? Number(yearTo) : undefined;

        return rows.filter((b) => {
            const gi = b.generalInfo;

            // keyword
            if (kw) {
                const haystack = [gi?.name, gi?.address, gi?.owner, b.buildingId]
                    .filter(Boolean)
                    .join(' ')
                    .toLowerCase();

                if (!haystack.includes(kw)) return false;
            }

            // buildingType
            if (buildingType !== 'all' && gi?.buildingType !== buildingType) {
                return false;
            }

            // climateZone
            if (climateZone !== 'all' && (gi?.climateZone ?? '') !== climateZone) {
                return false;
            }

            // commissioning year range
            const cy = gi?.commissioningYear;
            if (typeof yFrom === 'number') {
                if (typeof cy !== 'number' || cy < yFrom) return false;
            }
            if (typeof yTo === 'number') {
                if (typeof cy !== 'number' || cy > yTo) return false;
            }

            return true;
        });
    }, [rows, keyword, buildingType, climateZone, yearFrom, yearTo]);

    const pagedRows = useMemo(() => {
        const start = page * rowsPerPage;
        return filteredRows.slice(start, start + rowsPerPage);
    }, [filteredRows, page, rowsPerPage]);

    const toggleSelectOne = (id: string) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const pageIds = useMemo(() => pagedRows.map((r) => r.buildingId), [pagedRows]);

    const isAllOnPageSelected = useMemo(() => {
        if (pageIds.length === 0) return false;
        return pageIds.every((id) => selectedIds.has(id));
    }, [pageIds, selectedIds]);

    const isSomeOnPageSelected = useMemo(() => {
        if (pageIds.length === 0) return false;
        return pageIds.some((id) => selectedIds.has(id)) && !isAllOnPageSelected;
    }, [pageIds, selectedIds, isAllOnPageSelected]);

    const toggleSelectAllOnPage = () => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (isAllOnPageSelected) {
                pageIds.forEach((id) => next.delete(id));
            } else {
                pageIds.forEach((id) => next.add(id));
            }
            return next;
        });
    };

    const handleReset = () => {
        setKeyword('');
        setBuildingType('all');
        setClimateZone('all');
        setYearFrom('');
        setYearTo('');
        setPage(0);
    };

    const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
    const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(Number(e.target.value));
        setPage(0);
    };

    const handleOpenDelete = (buildingId: string, name?: string) => {
        setDeleteTarget({ buildingId, name });
    };

    const handleCancel = () => {
        if (isPending) return;
        setDeleteTarget(null);
    };

    const handleConfirm = () => {
        if (!deleteTarget) return;

        onDelete(deleteTarget.buildingId, {
            onSuccess: () => {
                setDeleteTarget(null);
            },
            onError: () => {
                setDeleteTarget(null);
            },
        });
    };

    return (
        <>
            <Box sx={{ p: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                    Quản lý toà nhà
                </Typography>

                {/* FILTER BAR */}
                <Paper sx={{ p: 2, mb: 2 }}>
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: '1fr',
                                md: '2fr 1fr 1fr 1fr 1fr auto',
                            },
                            gap: 2,
                            alignItems: 'center',
                        }}
                    >
                        <TextField
                            label="Tìm kiếm"
                            placeholder="Tên / địa chỉ / owner / buildingId..."
                            value={keyword}
                            onChange={(e) => {
                                setKeyword(e.target.value);
                                setPage(0);
                            }}
                            size="small"
                            fullWidth
                        />

                        <FormControl size="small" fullWidth>
                            <InputLabel>Kiểu toà nhà</InputLabel>
                            <Select
                                label="Kiểu toà nhà"
                                value={buildingType}
                                onChange={(e) => {
                                    setBuildingType(e.target.value as any);
                                    setPage(0);
                                }}
                            >
                                <MenuItem value="all">Tất cả</MenuItem>
                                <MenuItem value={1}>{BUILDING_TYPE_LABEL[1] ?? 'Type 1'}</MenuItem>
                                <MenuItem value={2}>{BUILDING_TYPE_LABEL[2] ?? 'Type 2'}</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl size="small" fullWidth>
                            <InputLabel>Climate Zone</InputLabel>
                            <Select
                                label="Climate Zone"
                                value={climateZone}
                                onChange={(e) => {
                                    setClimateZone(e.target.value as any);
                                    setPage(0);
                                }}
                            >
                                <MenuItem value="all">Tất cả</MenuItem>
                                {climateZoneOptions.map((cz) => (
                                    <MenuItem key={cz} value={cz}>
                                        {cz}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            label="Năm từ"
                            value={yearFrom}
                            onChange={(e) => {
                                setYearFrom(e.target.value.replace(/[^\d]/g, '').slice(0, 4));
                                setPage(0);
                            }}
                            size="small"
                            placeholder="Ví dụ 2010"
                            fullWidth
                        />

                        <TextField
                            label="Năm đến"
                            value={yearTo}
                            onChange={(e) => {
                                setYearTo(e.target.value.replace(/[^\d]/g, '').slice(0, 4));
                                setPage(0);
                            }}
                            size="small"
                            placeholder="Ví dụ 2024"
                            fullWidth
                        />

                        <Button variant="contained" onClick={() => setOpenExportConfirm(true)}>
                            {selectedIds.size > 0 ? `Xuất dữ liệu (${selectedIds.size})` : 'Xuất toàn bộ dữ liệu'}
                        </Button>

                        <Button variant="outlined" onClick={handleReset}>
                            Reset bộ lọc
                        </Button>
                    </Box>

                    <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                            Kết quả: {filteredRows.length} / {rows.length}
                        </Typography>
                    </Box>
                </Paper>

                {/* TABLE */}
                <Paper>
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={isAllOnPageSelected}
                                            indeterminate={isSomeOnPageSelected}
                                            onChange={toggleSelectAllOnPage}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Tên toà nhà</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Kiểu toà nhà</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Năm vận hành</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Tổng diện tích (m²)</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Thời gian tạo</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }} align="center">
                                        Hành động
                                    </TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {isLoading && (
                                    <TableRow>
                                        <TableCell colSpan={5}>Đang tải dữ liệu...</TableCell>
                                    </TableRow>
                                )}

                                {isError && !isLoading && (
                                    <TableRow>
                                        <TableCell colSpan={5}>Có lỗi khi tải danh sách toà nhà.</TableCell>
                                    </TableRow>
                                )}

                                {!isLoading && !isError && pagedRows.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5}>Không có dữ liệu.</TableCell>
                                    </TableRow>
                                )}

                                {!isLoading &&
                                    !isError &&
                                    pagedRows.map((b) => {
                                        const gi = b.generalInfo;
                                        return (
                                            <TableRow key={b.buildingId} hover>
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        checked={selectedIds.has(b.buildingId)}
                                                        onChange={() => toggleSelectOne(b.buildingId)}
                                                    />
                                                </TableCell>
                                                <TableCell>{gi?.name ?? '-'}</TableCell>
                                                <TableCell>
                                                    {BUILDING_TYPE_LABEL[gi?.buildingType as 1 | 2] ??
                                                        `Type ${gi?.buildingType ?? '-'}`}
                                                </TableCell>
                                                <TableCell>{gi?.commissioningYear ?? '-'}</TableCell>
                                                <TableCell>{gi?.totalFloorArea ?? '-'}</TableCell>
                                                <TableCell>{b.createdAt ? formatDateTime(b.createdAt) : '-'}</TableCell>
                                                <TableCell align="center">
                                                    <Tooltip title="Xem chi tiết">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => navigate(`/admin/buildings/${b.buildingId}`)}
                                                        >
                                                            <VisibilityIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Xoá">
                                                        <IconButton
                                                            color="error"
                                                            onClick={() =>
                                                                handleOpenDelete(b.buildingId, b.generalInfo?.name)
                                                            }
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <TablePagination
                        component="div"
                        count={filteredRows.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[10, 20, 50]}
                    />
                </Paper>
            </Box>
            <ConfirmDialog
                open={Boolean(deleteTarget)}
                title="Xoá toà nhà"
                description={
                    deleteTarget?.name
                        ? `Bạn có chắc chắn muốn xoá "${deleteTarget.name}"? Hành động này không thể hoàn tác.`
                        : undefined
                }
                loading={isPending}
                onCancel={handleCancel}
                onConfirm={handleConfirm}
            />
            <ConfirmDialog
                open={openExportConfirm}
                title="Xác nhận xuất dữ liệu"
                description={
                    selectedIds.size > 0
                        ? `Bạn có chắc chắn muốn xuất ${selectedIds.size} bản ghi vừa chọn không?`
                        : 'Bạn có chắc chắn muốn xuất toàn bộ dữ liệu không?'
                }
                loading={isExporting}
                onCancel={() => {
                    if (isExporting) return;
                    setOpenExportConfirm(false);
                }}
                onConfirm={async () => {
                    try {
                        const ids = Array.from(selectedIds);
                        await exportAsync(ids.length > 0 ? ids : undefined);

                        setOpenExportConfirm(false);
                        toastSuccess('Xuất bản ghi thành công');
                        setSelectedIds(new Set());
                    } catch {
                        toastError('Xuất bản ghi không thành công');
                    }
                }}
                confirmText="Xác nhận"
                confirmColor="primary"
            />
        </>
    );
}
