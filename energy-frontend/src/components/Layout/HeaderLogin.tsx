function HeaderLogin() {
    return (
        <div className=" gradient-border-b flex h-[100px] w-full items-center justify-center gap-3 ">
            <div className=" relative flex items-center">
                <input className="h-[40px] w-[500px] border-b-2 border-[#14B86E]" placeholder="Tìm kiếm" />
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute right-0 flex h-[20px] w-[20px] justify-end "
                >
                    <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                    <g id="SVGRepo_iconCarrier">
                        {'{'}' '{'}'}
                        <path
                            d="M20 20L15.8033 15.8033M18 10.5C18 6.35786 14.6421 3 10.5 3C6.35786 3 3 6.35786 3 10.5C3 14.6421 6.35786 18 10.5 18C14.6421 18 18 14.6421 18 10.5Z"
                            stroke="#000000"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        {'{'}' '{'}'}
                    </g>
                </svg>
            </div>
        </div>
    );
}

export default HeaderLogin;
