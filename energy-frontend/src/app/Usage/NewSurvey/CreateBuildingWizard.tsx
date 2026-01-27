import { yupResolver } from '@hookform/resolvers/yup';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import SendIcon from '@mui/icons-material/Send';
import {
    Box,
    Button,
    Container,
    Divider,
    List,
    ListItemButton,
    ListItemText,
    Paper,
    Stack,
    Typography,
} from '@mui/material';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';
import { toastAction, toastError, toastSuccess } from '../../../utils/toast';
import { useBuildingDetail, useCreateBuilding, useUpdateBuilding } from '../hooks/useBuilding';
import { userInformationSchema } from './schemas/userInformation.schema';
import GeneralInformationStep from './Sections/GeneralInformationStep';
import MonthlyElectricStep from './Sections/MonthlyElectricStep';
import OperationBuildingStep from './Sections/OperationBuildingStep';
import UserInformationStep from './Sections/UserInformationStep';
import type { BuildingFormValues } from './type/type';
import { formatBuildingPayload } from './utils/formatBuildingPayload';
import EPStep from './Sections/EPStep';
import { generalInformationSchema } from './schemas/generalInformation.schema';

const STEPS = [
    { key: 'user', label: 'Thông tin người dùng', desc: 'Nhập thông tin người tạo khảo sát' },
    { key: 'general', label: 'Thông tin chung', desc: 'Thông tin chung về toà nhà' },
    { key: 'operation', label: 'Vận hành toà nhà', desc: 'Thông tin vận hành theo khu vực' },
    { key: 'monthly', label: 'Điện năng tiêu thụ', desc: 'Điện tiêu thụ theo tháng' },
];

export type WizardMode = 'create' | 'view' | 'edit';

type Props = {
    mode?: WizardMode;
    buildingId?: string;
};

export default function CreateBuildingWizard({ mode = 'create', buildingId: buildingIdProp }: Props) {
    const contentRef = useRef<HTMLDivElement | null>(null);
    const [activeStep, setActiveStep] = useState(0);
    const navigate = useNavigate();
    const params = useParams();
    const [isFormReady, setFormReady] = useState(false);

    const buildingId = buildingIdProp || params?.buildingId || params?.id;

    const [modeLocal, setModeLocal] = useState<WizardMode>(mode);

    const isView = modeLocal === 'view';
    const isEdit = modeLocal === 'edit';
    const isCreate = modeLocal === 'create';

    const steps = useMemo(() => {
        if (isView) {
            return [...STEPS, { key: 'ep', label: 'Chỉ số EP', desc: 'Thông tin chỉ số EP của toà nhà' }];
        }
        return STEPS;
    }, [isView]);

    const defaultValues = useMemo<BuildingFormValues>(
        () => ({
            __meta: {
                readOnly: false,
            },
            user: {
                fullName: '',
                email: '',
                phone: '',
            },
            generalInfo: {
                name: '',
                address: '',
                owner: '',
                buildingType: 1,
                commissioningYear: undefined,

                climateZone: '',
                controlSystemType: '',

                hasHVAC: false,
                hasLighting: false,
                hasWaterHeating: false,
                otherSystems: '',

                setpointTemperature: undefined,
                setpointHumidity: undefined,
                setpointLightingLevel: undefined,

                governmentSystemZones: [],
                commercialOfficeZones: [],

                totalFloorArea: undefined,
                aboveGroundFloorArea: undefined,
                basementFloorArea: undefined,

                indoorParkingArea: undefined,
                outdoorParkingArea: undefined,
                parkingAnnualElectricity: [],

                dataCenterArea: undefined,
                dataCenterAnnualElectricity: [],

                nonRentableArea: undefined,
                totalRentableArea: undefined,
                vacantArea: undefined,
            },
            operation: {
                governmentZones: [],
                commercialZones: [],
            },
            consumedElectricity: [],
            producedElectricity: [],
        }),
        [],
    );

    const buildingWizardSchema = yup.object({
        user: userInformationSchema.required(),
        generalInfo: generalInformationSchema.required(),
        operation: yup.mixed().notRequired(),
        consumedElectricity: yup.mixed().notRequired(),
    });

    const methods = useForm<BuildingFormValues>({
        defaultValues,
        resolver: yupResolver(buildingWizardSchema as yup.ObjectSchema<BuildingFormValues>),
        mode: 'onBlur',
        shouldUnregister: false,
    });

    const { handleSubmit, trigger, reset } = methods;

    const createBuilding = useCreateBuilding();
    const updateBuilding = useUpdateBuilding();

    const detailQuery = useBuildingDetail(String(buildingId || ''), (isView || isEdit) && Boolean(buildingId));
    const detailData = detailQuery.data;

    useEffect(() => {
        if ((isView || isEdit) && detailData) {
            reset(detailData);
            setFormReady(true);
        }
        if (isCreate) {
            setFormReady(true);
        }
    }, [detailData, isView, isEdit, isCreate, reset]);

    useEffect(() => {
        if (!buildingId) return;
        if (!(isView || isEdit)) return;
        if (!detailData) return;

        reset(
            {
                ...defaultValues,
                ...detailData,
                generalInfo: { ...defaultValues.generalInfo, ...detailData.generalInfo },
                operation: { ...defaultValues.operation, ...detailData.operation },
                __meta: { readOnly: isView },
            },
            { keepDefaultValues: true },
        );
    }, [buildingId, isView, isEdit, detailData, reset, defaultValues]);

    const onSubmit = async (values: BuildingFormValues) => {
        const payload = formatBuildingPayload(values);
        console.log('🚀 ~ onSubmit ~ payload:', payload);

        if (isCreate) {
            createBuilding.mutate(payload, {
                onSuccess: () => {
                    toastSuccess('Tạo toà nhà thành công. Vui lòng kiểm tra hòm thư để xem chi tiết');
                    methods.reset(defaultValues);
                    setActiveStep(0);
                },
                onError: (error) => {
                    console.error('Create building failed:', error);
                    toastError('Tạo toà nhà thất bại. Vui lòng xem lại các trường dữ liệu.');
                },
            });
            return;
        }

        if (isEdit) {
            if (!buildingId) {
                toastError('Thiếu buildingId để cập nhật.');
                return;
            }

            updateBuilding.mutate(
                { buildingId: buildingId, data: payload },
                {
                    onSuccess: () => {
                        toastAction('Cập nhật toà nhà thành công', {
                            label: 'Quay lại chế độ xem',
                            onClick: () => setModeLocal('view'),
                        });
                        setModeLocal('view');
                    },
                    onError: (error) => {
                        console.error('Update building failed:', error);
                        toastError('Cập nhật thất bại. Vui lòng kiểm tra lại dữ liệu.');
                    },
                },
            );
        }
    };

    const renderStep = () => {
        switch (activeStep) {
            case 0:
                return <UserInformationStep />;
            case 1:
                return isFormReady ? <GeneralInformationStep /> : null;
            case 2:
                return <OperationBuildingStep />;
            case 3:
                return <MonthlyElectricStep />;
            case 4:
                return isView ? <EPStep buildingId={buildingId} /> : null;
            default:
                return null;
        }
    };

    function getFirstErrorPath(errObj: unknown, prefix = ''): string | null {
        if (!errObj || typeof errObj !== 'object') return null;

        if ('message' in (errObj as Record<string, unknown>) && prefix) return prefix;

        for (const key of Object.keys(errObj as Record<string, unknown>)) {
            const nextPrefix = prefix ? `${prefix}.${key}` : key;
            const found = getFirstErrorPath((errObj as Record<string, unknown>)[key], nextPrefix);
            if (found) return found;
        }
        return null;
    }

    function scrollToField(name: string) {
        const el =
            document.querySelector(`[name="${CSS.escape(name)}"]`) || document.querySelector(`#${CSS.escape(name)}`);

        if (!el) return;

        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (el instanceof HTMLElement) setTimeout(() => el.focus?.(), 150);
    }

    function scrollToTopAll() {
        if (contentRef.current) contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    }

    const handleNext = async () => {
        if (isView) {
            if (activeStep === steps.length - 1) {
                navigate(-1);
                return;
            }
            setActiveStep((s) => Math.min(s + 1, steps.length - 1));
            setTimeout(scrollToTopAll, 50);
            return;
        }

        if (activeStep === steps.length - 1) {
            const ok = await trigger(undefined, { shouldFocus: true }); // undefined = validate toàn bộ
            if (!ok) {
                await methods.handleSubmit(() => {})();
                // Tìm lỗi đầu tiên toàn form
                const firstErrorPath = getFirstErrorPath(methods.formState.errors);
                if (firstErrorPath) {
                    scrollToField(firstErrorPath);
                    methods.setFocus(firstErrorPath as Parameters<typeof methods.setFocus>[0]);
                }
                return;
            }
            handleSubmit(onSubmit)();
            return;
        }

        const stepFieldPrefixes: Array<keyof BuildingFormValues> = [
            'user',
            'generalInfo',
            'operation',
            'consumedElectricity',
        ];
        const currentStepKey = stepFieldPrefixes[activeStep];

        const ok = await trigger(currentStepKey, { shouldFocus: true });
        if (!ok) {
            await methods.handleSubmit(() => {})();

            const firstErrorPath = getFirstErrorPath(
                methods.formState.errors?.[currentStepKey],
                currentStepKey as string,
            );

            if (firstErrorPath) {
                scrollToField(firstErrorPath);
                methods.setFocus(firstErrorPath as Parameters<typeof methods.setFocus>[0]);
            }
            return;
        }

        if (activeStep === steps.length - 1) {
            handleSubmit(onSubmit)();
            return;
        }

        setActiveStep((s) => Math.min(s + 1, steps.length - 1));
        setTimeout(scrollToTopAll, 50);
    };

    const handleBack = () => setActiveStep((s) => Math.max(s - 1, 0));

    const handleToggleEdit = () => {
        if (isCreate) return;

        if (isView) {
            setModeLocal('edit');
            if (activeStep === 4) setActiveStep(0);
            return;
        }

        reset({ ...defaultValues, ...detailData }, { keepDefaultValues: true });
        setModeLocal('view');
    };

    const primaryBtnText = (() => {
        if (isView) return activeStep === steps.length - 1 ? 'Xong' : 'Tiếp tục';
        if (isEdit) return activeStep === steps.length - 1 ? 'Cập nhật' : 'Tiếp tục';
        return activeStep === steps.length - 1 ? 'Gửi đi' : 'Tiếp tục';
    })();

    const primaryBtnIcon = (() => {
        if (activeStep !== steps.length - 1) return <ArrowForwardIosIcon />;
        if (isEdit) return <SaveIcon />;
        if (isCreate) return <SendIcon />;
        return <ArrowForwardIosIcon />;
    })();

    const isLoadingDetail = (isView || isEdit) && detailQuery.isLoading;

    return (
        <FormProvider {...methods}>
            <Container
                maxWidth="xl"
                sx={{
                    py: 4,
                    bgcolor: '#F8FBFF',
                    boxShadow: '0 18px 45px rgba(15, 23, 42, 0.08)',
                    border: '1px solid rgba(15, 23, 42, 0.06)',
                }}
            >
                <Paper
                    elevation={0}
                    sx={{
                        borderRadius: 3,
                        border: (theme) => `1px solid ${theme.palette.divider}`,
                        overflow: 'hidden',
                    }}
                >
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '280px 1fr' }, minHeight: 520 }}>
                        {/* LEFT SIDEBAR */}
                        <Box sx={{ bgcolor: 'grey.50', borderRight: (t) => `1px solid ${t.palette.divider}` }}>
                            <Box
                                sx={{
                                    px: 2,
                                    py: 2,
                                    display: 'wrap',
                                    alignItems: 'center',

                                    gap: 1,
                                }}
                            >
                                <Typography variant="subtitle1" fontWeight={700}>
                                    Các bước khảo sát
                                </Typography>

                                {!isCreate && (
                                    <Button
                                        size="small"
                                        variant={isView ? 'contained' : 'outlined'}
                                        startIcon={isView ? <EditIcon /> : <CloseIcon />}
                                        onClick={handleToggleEdit}
                                    >
                                        {isView ? 'Chỉnh sửa' : 'Huỷ'}
                                    </Button>
                                )}
                            </Box>

                            <Divider />
                            <List sx={{ p: 1 }}>
                                {steps.map((s, idx) => {
                                    const selected = idx === activeStep;
                                    return (
                                        <ListItemButton
                                            key={s.key}
                                            selected={selected}
                                            onClick={() => setActiveStep(idx)}
                                            sx={{
                                                borderRadius: 2,
                                                mb: 0.5,
                                                '&.Mui-selected': { bgcolor: 'primary.50' },
                                            }}
                                        >
                                            <ListItemText
                                                primary={
                                                    <Typography fontWeight={selected ? 800 : 600}>
                                                        {idx + 1}. {s.label}
                                                    </Typography>
                                                }
                                                secondary={<Typography variant="caption">{s.desc}</Typography>}
                                            />
                                        </ListItemButton>
                                    );
                                })}
                            </List>
                        </Box>

                        {/* RIGHT CONTENT */}
                        <Box
                            ref={contentRef}
                            sx={{
                                p: { xs: 2, md: 3 },
                                overflowY: 'auto',
                                maxHeight: { xs: 'calc(100vh - 120px)', md: 'calc(100vh - 120px)' },
                            }}
                        >
                            <Stack spacing={1} sx={{ mb: 2 }}>
                                <Typography variant="h6" fontWeight={800}>
                                    {steps[activeStep].label}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {steps[activeStep].desc}
                                </Typography>
                            </Stack>

                            <Divider sx={{ mb: 2 }} />

                            {isLoadingDetail ? (
                                <Typography color="text.secondary">Đang tải dữ liệu toà nhà...</Typography>
                            ) : (
                                renderStep()
                            )}

                            <Divider sx={{ mt: 3, mb: 2 }} />

                            <Stack direction="row" justifyContent="space-between">
                                {activeStep !== 4 && (
                                    <>
                                        <Button
                                            variant="outlined"
                                            onClick={handleBack}
                                            disabled={activeStep === 0}
                                            startIcon={<ArrowForwardIosIcon sx={{ transform: 'rotate(180deg)' }} />}
                                        >
                                            Quay lại
                                        </Button>

                                        <Button
                                            variant="contained"
                                            onClick={handleNext}
                                            endIcon={primaryBtnIcon}
                                            disabled={
                                                isLoadingDetail || createBuilding.isPending || updateBuilding.isPending
                                            }
                                        >
                                            {primaryBtnText}
                                        </Button>
                                    </>
                                )}
                            </Stack>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </FormProvider>
    );
}
