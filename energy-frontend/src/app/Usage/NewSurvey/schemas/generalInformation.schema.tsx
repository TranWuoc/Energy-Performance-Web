import * as yup from 'yup';

const HHMM = /^([01]\d|2[0-3]):([0-5]\d)$/;

const timeRangeSchema = yup
    .object({
        from: yup
            .string()
            .nullable()
            .test('hhmm-from', 'from must be HH:mm', (v) => v == null || HHMM.test(v)),
        to: yup
            .string()
            .nullable()
            .test('hhmm-to', 'to must be HH:mm', (v) => v == null || HHMM.test(v)),
    })
    .noUnknown(true);

const govZoneCodes = ['administration', 'meeting', 'lobby', 'corridor_wc', 'security'] as const;
const comZoneCodes = [
    'rental_office',
    'meeting',
    'lobby',
    'corridor_wc',
    'security',
    'canteen_fnb',
    'commercial_area',
    'indoor_parking',
] as const;

const govSystemZoneSchema = yup
    .object({
        zoneCode: yup
            .mixed<(typeof govZoneCodes)[number]>()
            .oneOf([...govZoneCodes])
            .required(),
        hvac: timeRangeSchema.default({ from: null, to: null }),
        lighting: timeRangeSchema.default({ from: null, to: null }),
        waterHeating: timeRangeSchema.default({ from: null, to: null }),
        camera: timeRangeSchema.default({ from: null, to: null }),
    })
    .noUnknown(true);

const comSystemZoneSchema = yup
    .object({
        zoneCode: yup
            .mixed<(typeof comZoneCodes)[number]>()
            .oneOf([...comZoneCodes])
            .required(),
        hvac: timeRangeSchema.default({ from: null, to: null }),
        lighting: timeRangeSchema.default({ from: null, to: null }),
        waterHeating: timeRangeSchema.default({ from: null, to: null }),
        camera: timeRangeSchema.default({ from: null, to: null }),
    })
    .noUnknown(true);

const annualEnergyParkingSchema = yup
    .object({
        year: yup.number().required().integer().min(1900).max(3000),
        monthlyAverageEnergyConsumption: yup.number().required().min(0),
    })
    .noUnknown(true);
const annualEnergyDataCenterSchema = yup
    .object({
        year: yup.number().required().integer().min(1900).max(3000),
        monthlyAverageEnergyConsumption: yup.number().min(0).notRequired(),
        energyConsumption: yup.number().min(0).notRequired(),
    })
    .test(
        'require-energy',
        'energyConsumption (or monthlyAverageEnergyConsumption) is required',
        (obj) =>
            obj != null &&
            (typeof obj.energyConsumption === 'number' || typeof obj.monthlyAverageEnergyConsumption === 'number'),
    )
    .noUnknown(true);

export const generalInformationSchema = yup
    .object({
        name: yup.string().required('Tên toà nhà là trường bắt buộc'),
        address: yup.string().required('Địa chỉ toà nhà là trường bắt buộc'),
        owner: yup.string().optional(),

        buildingType: yup.number().required().oneOf([1, 2], 'buildingType must be 1 or 2'),

        commissioningYear: yup.number().optional().min(1900).max(3000),

        hasHVAC: yup.boolean().default(false),
        hasLighting: yup.boolean().default(false),
        hasWaterHeating: yup.boolean().default(false),
        otherSystems: yup.string().optional(),

        setpointTemperature: yup.number().optional(),
        setpointHumidity: yup.number().optional(),
        setpointLightingLevel: yup.number().optional(),

        controlSystemType: yup.string().optional(),
        climateZone: yup.string().optional(),

        outdoorParkingArea: yup.number().optional().min(0),
        indoorParkingArea: yup.number().optional().min(0),

        dataCenterArea: yup.number().optional().min(0),

        totalFloorArea: yup.number().required('Tổng diện tích sàn xây dựng là trường bắt buộc'),
        aboveGroundFloorArea: yup.number().required('Tổng diện tích sàn mặt đất là trường bắt buộc'),
        basementFloorArea: yup.number().required('Tổng diện tích sàn tầng hầm là trường bắt buộc'),

        nonRentableArea: yup.number().required('Diện tích phần không cho thuê là trường bắt buộc'),
        totalRentableArea: yup.number().required('Tổng diện tích cho thuê là trường bắt buộc').min(0),
        vacantArea: yup.number().required('Diện tích trống là trường bắt buộc').min(0),

        governmentSystemZones: yup.array().of(govSystemZoneSchema).default([]),
        commercialOfficeZones: yup.array().of(comSystemZoneSchema).default([]),

        parkingAnnualElectricity: yup.array().of(annualEnergyParkingSchema).default([]),
        dataCenterAnnualElectricity: yup.array().of(annualEnergyDataCenterSchema).default([]),
    })
    .test('zones-by-type', 'Zones do not match buildingType', function (value) {
        const bt = value?.buildingType;
        const gov = value?.governmentSystemZones?.length ?? 0;
        const com = value?.commercialOfficeZones?.length ?? 0;

        if (bt === 1 && com > 0)
            return this.createError({ path: 'commercialOfficeZones', message: 'Must be empty for Government office' });
        if (bt === 2 && gov > 0)
            return this.createError({ path: 'governmentSystemZones', message: 'Must be empty for Commercial office' });

        return true;
    })
    // BE rule: if totalParkingArea > 0 => parkingAnnualElectricity required
    .test(
        'parking-annual-required',
        'parkingAnnualElectricity is required when (indoorParkingArea + outdoorParkingArea) > 0',
        function (value) {
            const indoor = Number(value?.indoorParkingArea ?? 0);
            const outdoor = Number(value?.outdoorParkingArea ?? 0);
            const total = indoor + outdoor;
            const arr = value?.parkingAnnualElectricity ?? [];

            if (total > 0 && arr.length === 0) {
                return this.createError({
                    path: 'parkingAnnualElectricity',
                    message: 'Required when parking area > 0',
                });
            }
            return true;
        },
    )
    // BE rule: if dataCenterArea > 0 => dataCenterAnnualElectricity required
    .test('dc-annual-required', 'dataCenterAnnualElectricity is required when dataCenterArea > 0', function (value) {
        const dca = Number(value?.dataCenterArea ?? 0);
        const arr = value?.dataCenterAnnualElectricity ?? [];
        if (dca > 0 && arr.length === 0) {
            return this.createError({
                path: 'dataCenterAnnualElectricity',
                message: 'Required when dataCenterArea > 0',
            });
        }
        return true;
    });
