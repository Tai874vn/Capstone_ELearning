import api from './api';
import type { UserLogin, UserRegister, AuthUser } from '../types/Index';

export const authService = {
  async login(credentials: UserLogin): Promise<AuthUser> {
    const response = await api.post('/QuanLyNguoiDung/DangNhap', credentials);
    return response.data;
  },

  async register(userData: UserRegister): Promise<void> {
    await api.post('/QuanLyNguoiDung/DangKy', userData);
  },

  async getCurrentUser(): Promise<AuthUser> {
    const response = await api.get('/QuanLyNguoiDung/ThongTinTaiKhoan');
    return response.data;
  },

  logout(): void {
    localStorage.removeItem('ACCESS_TOKEN');
    localStorage.removeItem('USER_INFO');
  },
};