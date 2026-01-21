import { useNavigate } from 'react-router-dom';
import DropdownMenu from '../DropdownComponent/DropdownMenu';

function LeftSidebar() {
    const navigate = useNavigate();

    return (
        <div className="flex h-screen w-[300px] flex-col items-center bg-[#FAF9F7]">
            <img src="/Logo.svg" alt="logo" className="mt-[30px] h-[50px] w-[200px]" onClick={() => navigate('/')} />
            <div className=" mt-[20px] flex w-full flex-col ">
                <DropdownMenu
                    optionLabel="Khảo sát thông tin văn phòng"
                    options={[
                        { label: 'Thông tin chung', value: '1', to: '/home/general' },
                        { label: 'Vận hành toà nhà', value: '2', to: '/home/operator' },
                        { label: 'Năng lượng điện hàng tháng', value: '3', to: '/home/monthly-electricity' },
                    ]}
                />
                <DropdownMenu
                    optionLabel="Chỉ số năng lượng"
                    options={[
                        { label: 'Danh sách chỉ số năng lượng các toà nhà', value: '2', to: '/home' },
                        { label: 'Thống kê chỉ số năng lượng', value: '3', to: '/home' },
                    ]}
                />
            </div>
        </div>
    );
}

export default LeftSidebar;
