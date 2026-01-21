export type AdminUser = {
    username: string;
    email?: string;
    fullName?: string;
    role: string;
    isActive?: boolean;
    lastLogin?: string;
    createdAt?: string;
    updatedAt?: string;
};

export type LoginResponse = {
    success: boolean;
    message: string;
    data: {
        admin: AdminUser;
        token: string;
    };
};
