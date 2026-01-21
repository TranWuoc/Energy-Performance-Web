import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import { Box, Stack, Typography } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import Dot from './Dot';
import PillButton from './PillButton';

export type HeroTab = {
    headContent: string; // nội dung lớn
    content: string; // mô tả
};

type HeroCardProps = {
    tabs: HeroTab[];
    width?: number;
    height?: number;
    autoPlayMs?: number;
    className?: string;
    theme?: 'blue' | 'green';
};

export default function HeroCard({
    tabs,
    autoPlayMs = 3000,
    className = '',
    theme = 'green',
    width,
    height,
}: HeroCardProps) {
    //     const tabs = useMemo(() => TABS, []);
    const [index, setIndex] = useState(0);
    const [direction, setDirection] = useState<1 | -1>(1);
    const timerRef = useRef<number | null>(null);

    const resetAutoplay = () => {
        if (timerRef.current) window.clearInterval(timerRef.current);
        timerRef.current = window.setInterval(() => {
            setDirection(1);
            setIndex((prev) => (prev + 1) % tabs.length);
        }, autoPlayMs);
    };

    useEffect(() => {
        resetAutoplay();
        return () => {
            if (timerRef.current) window.clearInterval(timerRef.current);
        };
    }, [tabs.length]);

    const goNext = () => {
        setDirection(1);
        setIndex((prev) => (prev + 1) % tabs.length);
        resetAutoplay();
    };

    const goPrev = () => {
        setDirection(-1);
        setIndex((prev) => (prev - 1 + tabs.length) % tabs.length);
        resetAutoplay();
    };

    const active = tabs[index];

    return (
        <Box
            sx={{
                borderRadius: 6,
                overflow: 'hidden',
                position: 'relative',
                bgcolor: theme === 'blue' ? '#2D63F2' : '#28A745',
                color: 'white',
                p: { xs: 3, md: 4 },
                minHeight: { xs: 260, md: 400 },
                width: width || '100%',
                height: height || 'auto',
                boxShadow: '0 10px 24px rgba(45, 99, 242, 0.20)',
                className,
            }}
        >
            <Box sx={{ pr: { xs: 0, md: 6 } }}>
                <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                        key={index}
                        initial={{
                            opacity: 0,
                            x: direction === 1 ? 18 : -18,
                            filter: 'blur(2px)',
                        }}
                        animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                        exit={{
                            opacity: 0,
                            x: direction === 1 ? -18 : 18,
                            filter: 'blur(2px)',
                        }}
                        transition={{ duration: 0.35, ease: 'easeOut' }}
                    >
                        <Typography
                            sx={{
                                fontWeight: 400,
                                letterSpacing: 0.2,
                                fontSize: { xs: 30, md: 42 },
                                lineHeight: 1.1,
                                maxWidth: 640,
                                mb: 1.5,
                            }}
                        >
                            {active.headContent}
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: { xs: 14.5, md: 16 },
                                lineHeight: 1.55,
                                color: 'rgba(255,255,255,0.88)',
                                maxWidth: 680,
                            }}
                        >
                            {active.content}
                        </Typography>
                    </motion.div>
                </AnimatePresence>
            </Box>

            <Box
                sx={{
                    position: 'absolute',
                    left: 24,
                    right: 24,
                    bottom: 18,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 2,
                }}
            >
                <PillButton startIcon={<ArrowBackIosNewRoundedIcon />} variant="outlined" onClick={goPrev}>
                    Quay lại
                </PillButton>

                <Stack direction="row" spacing={1} alignItems="center">
                    {tabs.map((_, i) => (
                        <Dot key={i} active={i === index} />
                    ))}
                </Stack>

                <PillButton endIcon={<ArrowForwardIosRoundedIcon />} variant="outlined" onClick={goNext}>
                    Tiếp tục
                </PillButton>
            </Box>
        </Box>
    );
}
