// src/hooks/auth/useLogin.ts
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { login } from '../../../api/auth/auth.api';
import type { LoginResponse } from '../../../api/auth/auth.type';
import { toastAction } from '../../../utils/toast';

export const useLogin = () => {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: (payload: { username: string; password: string }) => login(payload.username, payload.password),

        onSuccess: (res: LoginResponse) => {
            if (!res?.success) {
                toast.error(res?.message ?? 'Đăng nhập thất bại');
                return;
            }

            const token = res.data?.token;
            const admin = res.data?.admin;

            if (!token || !admin) {
                toast.error('Thiếu dữ liệu token/admin từ server');
                return;
            }

            localStorage.setItem('accessToken', token);
            localStorage.setItem('currentAdmin', JSON.stringify(admin));

            let timeoutId: ReturnType<typeof setTimeout> | null = null;

            toastAction('Đăng nhập thành công!', {
                label: 'Đi đến Dashboard',
                onClick: () => {
                    if (timeoutId) clearTimeout(timeoutId);
                    navigate('/admin/dashboard');
                },
            });

            timeoutId = setTimeout(() => {
                navigate('/admin/dashboard');
            }, 3000);
        },

        onError: (error: any) => {
            toast.error(error.response?.data?.message);
        },
    });
};
