import type { ButtonProps } from '@mui/material/Button';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

type Props = {
    open: boolean;
    title?: string;
    description?: string;
    loading?: boolean;
    onCancel: () => void;
    onConfirm: () => void;

    confirmText?: string;
    confirmColor?: ButtonProps['color'];
    confirmVariant?: ButtonProps['variant'];
};

export default function ConfirmDialog({
    open,
    title = 'Xác nhận',
    description = 'Bạn có chắc chắn muốn thực hiện hành động này?',
    loading = false,
    onCancel,
    onConfirm,
    confirmText = 'Xác nhận',
    confirmColor = 'primary',
    confirmVariant = 'contained',
}: Props) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Dialog fullScreen={fullScreen} open={open} onClose={loading ? undefined : onCancel}>
            <DialogTitle>{title}</DialogTitle>

            <DialogContent>
                <DialogContentText>{description}</DialogContentText>
            </DialogContent>

            <DialogActions>
                <Button onClick={onCancel} disabled={loading}>
                    Huỷ
                </Button>

                <Button
                    variant={confirmVariant}
                    color={confirmColor}
                    onClick={onConfirm}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={16} /> : undefined}
                >
                    {confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
