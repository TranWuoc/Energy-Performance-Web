import VisibilityIcon from '@mui/icons-material/Visibility';
import {
    Box,
    Button,
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
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BUILDING_TYPE_LABEL } from '../../../constants';
import { useEPList } from './hooks/useEPList';
import type { EPRecord } from './Types/ep.type';

function formatDateTime(iso?: string) {
    if (!iso) return '-';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString();
}

export default function EPSPage() {
    const navigate = useNavigate();
    const { data, isLoading, isError } = useEPList();

    // Filters
    const [keyword, setKeyword] = useState('');
    const [year, setYear] = useState<number | 'all'>('all');
    const [buildingType, setBuildingType] = useState<number | 'all'>('all');

    // Pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const rows: EPRecord[] = data?.data ?? [];

    // year options from data
    const yearOptions = useMemo(() => {
        const s = new Set<number>();
        rows.forEach((r) => {
            if (typeof r.year === 'number') s.add(r.year);
        });
        return Array.from(s).sort((a, b) => b - a);
    }, [rows]);

    const filteredRows = useMemo(() => {
        const kw = keyword.trim().toLowerCase();

        return rows.filter((r) => {
            // keyword by buildingName (và tiện thì thêm buildingId)
            if (kw) {
                const haystack = [r.buildingName, r.buildingId].filter(Boolean).join(' ').toLowerCase();
                if (!haystack.includes(kw)) return false;
            }

            // year
            if (year !== 'all' && r.year !== year) return false;

            // buildingType
            if (buildingType !== 'all' && r.buildingType !== buildingType) return false;

            return true;
        });
    }, [rows, keyword, year, buildingType]);

    const handleResetFilters = () => {
        setKeyword('');
        setYear('all');
        setBuildingType('all');
        setPage(0);
    };

    const pagedRows = useMemo(() => {
        const start = page * rowsPerPage;
        return filteredRows.slice(start, start + rowsPerPage);
    }, [filteredRows, page, rowsPerPage]);

    const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);

    const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(Number(e.target.value));
        setPage(0);
    };

    useEffect(() => {
        setPage(0);
    }, [rows.length, rowsPerPage]);

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                Thống kê EP
            </Typography>

            {/* FILTER BAR */}
            <Paper sx={{ p: 2, mb: 2 }}>
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1fr auto' },
                        gap: 2,
                        alignItems: 'center',
                    }}
                >
                    <TextField
                        label="Tìm theo tên"
                        placeholder="Nhập tên toà nhà..."
                        value={keyword}
                        onChange={(e) => {
                            setKeyword(e.target.value);
                            setPage(0);
                        }}
                        size="small"
                        fullWidth
                    />

                    <FormControl size="small" fullWidth>
                        <InputLabel>Năm</InputLabel>
                        <Select
                            label="Năm"
                            value={year}
                            onChange={(e) => {
                                setYear(e.target.value as any);
                                setPage(0);
                            }}
                        >
                            <MenuItem value="all">Tất cả</MenuItem>
                            {yearOptions.map((y) => (
                                <MenuItem key={y} value={y}>
                                    {y}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

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

                    <Button variant="outlined" onClick={handleResetFilters} sx={{ height: 40, whiteSpace: 'nowrap' }}>
                        Reset bộ lọc
                    </Button>
                </Box>
            </Paper>

            {/* TABLE */}
            <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 650 }}>Tên toà nhà</TableCell>
                            <TableCell sx={{ fontWeight: 700, width: 300 }}>Kiểu toà nhà</TableCell>
                            <TableCell sx={{ fontWeight: 700, width: 200 }}>Năm vận hành</TableCell>
                            <TableCell sx={{ fontWeight: 700, width: 120 }}>Chỉ số EP</TableCell>
                            <TableCell sx={{ fontWeight: 700, width: 200 }}>Thời gian tạo</TableCell>
                            <TableCell sx={{ fontWeight: 700, width: 150 }} align="center">
                                Hành động
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6}>Đang tải...</TableCell>
                            </TableRow>
                        ) : isError ? (
                            <TableRow>
                                <TableCell colSpan={6}>Có lỗi khi tải dữ liệu EP.</TableCell>
                            </TableRow>
                        ) : pagedRows.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6}>Không có dữ liệu.</TableCell>
                            </TableRow>
                        ) : (
                            pagedRows.map((r: EPRecord) => (
                                <TableRow key={r._id}>
                                    {' '}
                                    <TableCell>{r.buildingName ?? '-'}</TableCell>
                                    <TableCell>{BUILDING_TYPE_LABEL[r.buildingType] ?? r.buildingType}</TableCell>
                                    <TableCell>{r.year ?? '-'}</TableCell>
                                    <TableCell>{typeof r.ep === 'number' ? r.ep.toFixed(2) : '-'}</TableCell>
                                    <TableCell>{formatDateTime(r.computedAt)}</TableCell>
                                    <TableCell align="center">
                                        <Tooltip title="Xem chi tiết EP">
                                            <IconButton
                                                size="small"
                                                onClick={() => navigate(`/admin/energy-performance/${r.buildingId}`)}
                                            >
                                                <VisibilityIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>

                <TablePagination
                    component="div"
                    count={filteredRows.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 20, 50]}
                />
            </TableContainer>
        </Box>
    );
}
