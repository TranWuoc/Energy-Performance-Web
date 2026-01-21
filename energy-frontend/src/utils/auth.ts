export type CurrentAdmin = {
    username: string;
    email?: string;
    fullName?: string;
    role: string;
};

export function getCurrentAdmin(): CurrentAdmin | null {
    const raw = localStorage.getItem('currentAdmin');
    if (!raw) return null;

    try {
        return JSON.parse(raw) as CurrentAdmin;
    } catch {
        return null;
    }
}
