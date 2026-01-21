import { getBuildings } from '../../api/buildings/buildings.api';

export default function Buildings() {
    return (
        <div>
            <button
                className="h-[50px] w-[100px] bg-amber-200"
                onClick={async () => {
                    const data = await getBuildings();
                    console.log(data);
                }}
            >
                Get Buildings
            </button>
        </div>
    );
}
