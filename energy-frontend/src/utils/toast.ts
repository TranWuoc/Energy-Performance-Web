import React from 'react';
import toast, { type Toast, type ToastOptions } from 'react-hot-toast';

/**
 * Config chung cho toàn bộ toast
 */
const baseOptions: ToastOptions = {
    position: 'top-right',
    duration: 3000,
    style: {
        background: '#1f2933',
        color: '#fff',
        fontSize: '14px',
    },
};

export const toastAction = (
    message: string,
    action: { label: string; onClick: () => void },
    options?: ToastOptions,
) => {
    return toast(
        (t: Toast) =>
            React.createElement(
                'div',
                { style: { display: 'flex', alignItems: 'center', gap: 12 } },
                React.createElement('span', null, message),
                React.createElement(
                    'button',
                    {
                        type: 'button',
                        onClick: () => {
                            action.onClick();
                            toast.dismiss(t.id);
                        },
                        style: {
                            background: '#14B86E',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 4,
                            padding: '4px 8px',
                            cursor: 'pointer',
                            fontSize: 13,
                        },
                    },
                    action.label,
                ),
            ),
        { duration: 3000, ...options },
    );
};

/**
 * Toast success
 */
export const toastSuccess = (message: string, options?: ToastOptions) =>
    toast.success(message, {
        ...baseOptions,
        ...options,
    });

/**
 * Toast error
 */
export const toastError = (message: string, options?: ToastOptions, errorDetail?: string) =>
    toast.error(errorDetail ? `${message}: ${errorDetail}` : message, {
        ...baseOptions,
        ...options,
    });

/**
 * Toast info / default
 */
export const toastInfo = (message: string, options?: ToastOptions) =>
    toast(message, {
        ...baseOptions,
        ...options,
    });

/**
 * Toast loading (trả về toastId để dismiss)
 */
export const toastLoading = (message = 'Loading...') =>
    toast.loading(message, {
        ...baseOptions,
    });

/**
 * Dismiss toast
 */
export const toastDismiss = (toastId?: string) => toast.dismiss(toastId);

/**
 * Toast cho promise (API, submit form, etc.)
 */
export const toastPromise = <T>(
    promise: Promise<T>,
    messages: {
        loading: string;
        success: string;
        error: string;
    },
    options?: ToastOptions,
) =>
    toast.promise(promise, messages, {
        ...baseOptions,
        ...options,
    });
