import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { Box, Button, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
            >
                <Box
                    sx={{
                        textAlign: 'center',
                        px: 4,
                        py: 5,
                        borderRadius: 2,
                    }}
                >
                    {/* ICON */}
                    <ErrorOutlineOutlinedIcon
                        sx={{
                            fontSize: 72,
                            color: 'text.secondary',
                            mb: 2,
                        }}
                    />

                    <Typography variant="h4" fontWeight={600} gutterBottom>
                        404 – Không tìm thấy trang
                    </Typography>

                    <Typography color="text.secondary" mb={4} maxWidth={420}>
                        Trang bạn đang truy cập không tồn tại hoặc tính năng đang được phát triển.
                    </Typography>

                    <Button variant="contained" onClick={() => navigate('/')}>
                        Quay về trang chủ
                    </Button>
                </Box>
            </motion.div>
        </Box>
    );
}
