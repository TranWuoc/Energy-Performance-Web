// import { createContext, useContext, useState, type ReactNode } from 'react';
// import type { FormSaveGeneralInformation } from '../app/Survey/GeneralInformation/type';
// import type { FormOperatorBuilding } from '../app/Survey/OperatorBuilding/type';
// import type { FormMonthlyElectricity } from '../app/Survey/MonthlyElectricity/type';
// // Tổng hợp tất cả data từ các form
// export interface SurveyData {
//     generalInformation: Partial<FormSaveGeneralInformation>;
//     operatorBuilding: Partial<FormOperatorBuilding>;
//     monthlyElectricity: Partial<FormMonthlyElectricity>;
// }

// interface SurveyContextType {
//     surveyData: SurveyData;
//     updateGeneralInformation: (data: FormSaveGeneralInformation) => void;
//     updateOperatorBuilding: (data: FormOperatorBuilding) => void;
//     updateMonthlyElectricity: (data: FormMonthlyElectricity) => void;
//     resetSurvey: () => void;
//     isComplete: () => boolean;
// }

// const initialSurveyData: SurveyData = {
//     generalInformation: {},
//     operatorBuilding: {},
//     monthlyElectricity: {},
// };

// const SurveyContext = createContext<SurveyContextType | undefined>(undefined);

// export function SurveyProvider({ children }: { children: ReactNode }) {
//     const [surveyData, setSurveyData] = useState<SurveyData>(initialSurveyData);

//     const updateGeneralInformation = (data: FormSaveGeneralInformation) => {
//         setSurveyData((prev) => ({
//             ...prev,
//             generalInformation: data,
//         }));
//     };

//     const updateOperatorBuilding = (data: FormOperatorBuilding) => {
//         setSurveyData((prev) => ({
//             ...prev,
//             operatorBuilding: data,
//         }));
//     };

//     const updateMonthlyElectricity = (data: FormMonthlyElectricity) => {
//         setSurveyData((prev) => ({
//             ...prev,
//             monthlyElectricity: data,
//         }));
//     };

//     const isComplete = () => {
//         const hasGeneral = Object.keys(surveyData.generalInformation).length > 0;
//         const hasOperator = Object.keys(surveyData.operatorBuilding).length > 0;
//         const hasMonthly = Object.keys(surveyData.monthlyElectricity).length > 0;
//         return hasGeneral && hasOperator && hasMonthly;
//     };

//     const resetSurvey = () => {
//         setSurveyData(initialSurveyData);
//     };

//     return (
//         <SurveyContext.Provider
//             value={{
//                 surveyData,
//                 updateGeneralInformation,
//                 updateOperatorBuilding,
//                 updateMonthlyElectricity,
//                 resetSurvey,
//                 isComplete,
//             }}
//         >
//             {children}
//         </SurveyContext.Provider>
//     );
// }

// export function useSurvey() {
//     const context = useContext(SurveyContext);
//     if (!context) {
//         throw new Error('useSurvey must be used within a SurveyProvider');
//     }
//     return context;
// }
