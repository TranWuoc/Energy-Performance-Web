import * as yup from 'yup';

export const userInformationSchema = yup.object({
    fullName: yup.string().trim().required('Vui lòng nhập họ tên'),
    email: yup.string().trim().email('Email không hợp lệ').required('Vui lòng nhập email'),
    phone: yup.string().trim().required('Vui lòng nhập số điện thoại'),
});
