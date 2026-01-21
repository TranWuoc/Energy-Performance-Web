import { Box, Container, type Theme, useMediaQuery } from '@mui/material';
import BigImageCard from './components/BigImageCard';
import type { HeroTab } from './components/HeroCard';
import HeroCard from './components/HeroCard';
import SmallProjectCard from './components/SmallProject';

type ProjectCard = {
    title: string;
    location: string;
    image: string;
};

const projects: ProjectCard[] = [
    {
        title: 'Capital Place',
        location: '29 Lieu Giai, Ngoc Khanh, Ba Dinh, Ha Noi, Vietnam',
        image: 'https://cdn.prod.website-files.com/64ca09a8c5ba2dc72fae31bb/64d1ffab04f55daf9871c6d8_PANO0001-Pano-crop-2%20lo%CC%9B%CC%81n.jpeg',
    },
    {
        title: 'Pacific Place',
        location: '83B Ly Thuong Kiet, Cua Nam, Hoan Kiem, Ha Noi, Vietnam',
        image: '	https://maisonoffice.vn/wp-content/uploads/2017/06/toa-nha-pacific-place-ly-thuong-kiet-1.jpg',
    },
    {
        title: 'HeadQuarters Techcombank',
        location: '06 Quang Trung, Cua Nam, Hoan Kiem, Ha Noi, Vietnam',
        image: 'https://techcombank.com/content/dam/techcombank/public-site/sites/ve-chung-toi/ho-hn-ve-techcombank.png.rendition/cq5dam.web.1280.1280.png',
    },
];

const TABS: HeroTab[] = [
    {
        headContent: 'Định mức năng lượng và số hoá toàn diện quy trình kiểm định',
        content:
            'Hệ thống tập chung thu thập, khảo sát, xử lý dữ liệu của 2 mô hình văn phòng là: Văn phòng nhà nước và văn phòng thương mại.',
    },
    {
        headContent: 'Văn phòng nhà nước',
        content:
            'Công cụ được thiết kế để hỗ trợ các cơ quan chính phủ tuân thủ quy định và tiêu chuẩn về sử dụng năng lượng. Cung cấp dữ liệu chính xác để dễ dàng quản lý, báo cáo và tiết kiệm ngân sách một cách hiệu quả nhất.',
    },
    {
        headContent: 'Văn phòng thương mại',
        content:
            'Giúp doanh nghiệp biến chi phí năng lượng thành một lợi thế cạnh tranh. Bằng cách phân tích chuyên sâu, sẽ tìm ra các điểm lãng phí, giảm chi phí vận hành và nâng cao hình ảnh thương hiệu bền vững trong mắt khách hàng và đối tác.',
    },
];

export default function SecsionShowTypeBuilding() {
    const isMdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));

    return (
        <Box
            sx={{
                minHeight: '100vh',
                bgcolor: '#EAF1FF',
                py: { xs: 3, md: 5 },
            }}
        >
            <Container maxWidth="lg">
                <Box
                    sx={{
                        bgcolor: '#F6FAFF',
                        borderRadius: 6,
                        p: { xs: 2, md: 3 },
                        boxShadow: '0 10px 30px rgba(25, 60, 140, 0.10)',
                    }}
                >
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', md: '1.05fr 1fr' },
                            gap: { xs: 2, md: 3 },
                            alignItems: 'stretch',
                        }}
                    >
                        {/* LEFT */}
                        <Box sx={{ display: 'grid', gap: { xs: 2, md: 3 } }}>
                            <HeroCard tabs={TABS} autoPlayMs={3000} />

                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: { xs: 2, md: 3 },
                                }}
                            >
                                <SmallProjectCard
                                    title={projects[0].title}
                                    location={projects[0].location}
                                    image={projects[0].image}
                                />
                                <SmallProjectCard
                                    title={projects[1].title}
                                    location={projects[1].location}
                                    image={projects[1].image}
                                />
                            </Box>
                        </Box>

                        {/* RIGHT */}
                        <BigImageCard
                            title={projects[2].title}
                            location={projects[2].location}
                            image={projects[2].image}
                            tall={isMdUp}
                        />
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}
