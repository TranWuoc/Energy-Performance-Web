import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import DropdownTimeRange from '../DropdownComponent/DropdownTimeRange';
import InputField from '../InputField';

const ZONES = [
    {
        code: 'administration',
        label: 'a. Khu làm việc hành chính',
        systems: ['hvac', 'lighting'],
    },
    {
        code: 'meeting',
        label: 'b. Hội trường/ phòng họp lớn',
        systems: ['hvac', 'lighting'],
    },
    {
        code: 'lobby',
        label: 'c. Sảnh chính & lễ tân',
        systems: ['hvac', 'lighting'],
    },
    {
        code: 'corridor_wc',
        label: 'd. Hành lang, cầu thang bộ, khu vệ sinh',
        systems: ['hvac', 'lighting', 'waterHeating'],
    },
    {
        code: 'security',
        label: 'e. Khu bảo vệ/ an ninh',
        systems: ['hvac', 'lighting', 'camera'],
    },
];

const SYSTEM_LABELS: Record<string, string> = {
    hvac: 'Hệ thống HVAC',
    lighting: 'Hệ thống chiếu sáng',
    waterHeating: 'Hệ thống cấp nước nóng',
    camera: 'Hệ thống camera',
};

function GovernmentOffice() {
    const { setValue } = useFormContext();

    useEffect(() => {
        ZONES.forEach((zone, index) => {
            setValue(`governmentSystemZones.${index}.zoneCode`, zone.code);
        });
    }, [setValue]);

    return (
        <div className="flex flex-col gap-[30px]">
            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                {ZONES.map((zone, index) => (
                    <div key={zone.code} className="flex flex-col">
                        <span className="font-bold">{zone.label}</span>
                        {zone.systems.map((system) => (
                            <div
                                key={`${zone.code}-${system}`}
                                className="flex w-[450px] items-center justify-between gap-4"
                            >
                                <span className="ml-[50px]">{SYSTEM_LABELS[system]}</span>
                                <div className="flex items-center gap-2">
                                    <InputField
                                        name={`governmentSystemZones.${index}.${system}`}
                                        component={DropdownTimeRange}
                                        size="timeSize"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default GovernmentOffice;
