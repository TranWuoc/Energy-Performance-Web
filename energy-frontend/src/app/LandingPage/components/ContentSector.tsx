interface ContentSectorProps {
    title: string;
    description: string;
    className?: string;
}

function ContentSector({ title, description, className }: ContentSectorProps) {
    return (
        <div className={` flex flex-col ${className}`}>
            <div className="absolute flex h-[30px] w-1 items-center bg-green-400"></div>
            <h1 className="ml-[10px] w-[200px] font-black">{title}</h1>
            <p className="text-green-color ml-[10px] w-[300px]">{description}</p>
        </div>
    );
}

export default ContentSector;
