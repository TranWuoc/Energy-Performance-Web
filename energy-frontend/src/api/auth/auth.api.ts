import http from '../../utils/http';

export const login = async (username: string, password: string) => {
    const { data } = await http.post('/auth/login', { username, password });
    return data;
};
