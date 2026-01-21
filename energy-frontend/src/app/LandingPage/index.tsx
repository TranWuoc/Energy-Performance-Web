import SecsionShowTypeBuilding from './SecsionShowTypeBuilding';
import Section2 from './Section2';

function LandingPage() {
    return (
        <div className="flex w-full flex-col px-4">
            {/* Section1 */}
            <div className=" flex h-[600px] w-full px-[100px] py-[20px]">
                <div className=" flex rounded-2xl bg-[radial-gradient(50%_17%_at_50.6%_100%,_#a7f9b1_0%,_#FAFAFA_99.99%,_#FAFAFA_100%)]">
                    <div className=" flex h-[500px] w-full flex-col justify-center pl-[150px]">
                        <h1 className=" text-6xl font-bold uppercase">EEBM</h1>
                        <p>Định mức năng lượng và số hoá toàn diện quy trình kiểm định</p>

                        <div className=" mt-10 flex flex-col gap-5">
                            <div className="xlg:text-sm flex items-center gap-2">
                                <div
                                    className="flex h-[18px] w-[18px] items-center justify-center rounded-full border border-[#B3B3B3]"
                                    style={{ boxShadow: '0px 2px 0px 0px #494756' }}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width={11}
                                        height={9}
                                        viewBox="0 0 11 9"
                                        fill="none"
                                    >
                                        <path
                                            d="M3.43125 6.43359L9.61094 0.253906L10.4313 1.07422L3.43125 8.07422L0.177344 4.82031L0.997656 4L3.43125 6.43359Z"
                                            fill="#2C2A36"
                                        />
                                    </svg>
                                </div>
                                <p className="mt-[4px] flex-1 text-sm font-medium text-[#525252]">
                                    Tối ưu hoá chi phí năng lượng
                                </p>
                            </div>
                            <div className="xlg:text-sm flex items-center gap-2">
                                <div
                                    className="flex h-[18px] w-[18px] items-center justify-center rounded-full border border-[#B3B3B3]"
                                    style={{ boxShadow: '0px 2px 0px 0px #494756' }}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width={11}
                                        height={9}
                                        viewBox="0 0 11 9"
                                        fill="none"
                                    >
                                        <path
                                            d="M3.43125 6.43359L9.61094 0.253906L10.4313 1.07422L3.43125 8.07422L0.177344 4.82031L0.997656 4L3.43125 6.43359Z"
                                            fill="#2C2A36"
                                        />
                                    </svg>
                                </div>
                                <p className="mt-[4px] flex-1 text-sm font-medium text-[#525252]">
                                    Đưa ra các giải pháp tiết kiệm năng lượng hiệu quả
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className=" flex items-center pr-[200px]">
                        <img src="/abc.png" alt="Landing Page Image" className="h-[500px] w-[900px]" />
                    </div>
                </div>
            </div>
            <Section2 />
            <SecsionShowTypeBuilding />
        </div>
    );
}

export default LandingPage;
