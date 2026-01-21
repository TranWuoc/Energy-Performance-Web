import type { HeroTab } from './components/HeroCard';
import HeroCard from './components/HeroCard';

const SECTION2_TABS: HeroTab[] = [
    {
        headContent: 'Lãng phí năng lượng của văn phòng',
        content:
            'Cung cấp công cụ đưa ra cái nhìn toàn diện về mức tiêu thụ năng lượng của từng khu vực trong văn phòng, từ điều hòa, chiếu sáng cho đến các thiết bị điện tử.',
    },
    {
        headContent: 'Báo cáo hiệu quả năng lượng toàn diện',
        content:
            'Với bảng nhập liệu khảo sát dễ dàng, hệ thống sẽ tạo ra báo cáo phân tích chi tiết. Tất cả dữ liệu và phân tích được trình bày trực quan, dễ hiểu, giúp đưa ra các giải pháp hiệu quả.',
    },
    {
        headContent: 'So sánh hiệu suất với tiêu chuẩn quốc gia',
        content:
            'Công cụ sẽ so sánh mức tiêu thụ năng lượng của bạn với định mức chuẩn, giúp xác định vị trí của mình và thấy rõ tiềm năng cải thiện.',
    },
    {
        headContent: 'Giải pháp tiết kiệm thực tế',
        content:
            'Dựa trên dữ liệu thu thập từ khảo sát, hệ thống sẽ đề xuất các giải pháp tiết kiệm năng lượng cụ thể, từ việc tối ưu hóa hệ thống chiếu sáng, điều hòa cho đến các mẹo vận hành hiệu quả hàng ngày.',
    },
    {
        headContent: 'Đạt chuẩn công trình xanh',
        content:
            'Một công trình tiết kiệm năng lượng không chỉ giúp giảm chi phí mà còn thể hiện trách nhiệm với môi trường và nâng cao uy tín thương hiệu.',
    },
];

export default function Section2() {
    return (
        <section className="w-full bg-[#F1ECE5]  py-10">
            <h1 className="text-green-color flex items-center justify-center text-4xl font-black uppercase">
                Đánh giá hiệu suất năng lượng và các giải pháp tối ưu
            </h1>

            <div className="mt-10 flex flex-col items-center justify-center gap-10 px-6 lg:flex-row lg:items-start">
                {/* LEFT: Tabs */}
                <div className="w-full max-w-[760px] lg:max-w-[720px]">
                    <HeroCard tabs={SECTION2_TABS} autoPlayMs={3000} theme="green" height={500} />
                </div>

                {/* RIGHT: Image giữ nguyên */}
                <div className="flex w-full max-w-[520px] items-center justify-center">
                    <img src="/idea.png" alt="idea" className="h-[500px] w-[500px]" />
                </div>
            </div>
        </section>
    );
}
