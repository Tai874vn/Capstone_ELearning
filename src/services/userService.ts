import api from './api';
import type { UpdateUserRequest, User } from '../types/Index';

export const userService = {
  // Update user information
  updateUserInfo: async (userData: UpdateUserRequest): Promise<User> => {
    try {
      const response = await api.put('/QuanLyNguoiDung/CapNhatThongTinNguoiDung', userData);
      return response.data;
    } catch (error: unknown) {
      // console.error('Update user info error:', error);

      const err = error as { response?: { data?: { message?: string } } };
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      } else if (err.response?.data) {
        throw new Error('Cập nhật thông tin thất bại');
      } else {
        throw new Error('Lỗi kết nối. Vui lòng thử lại.');
      }
    }
  },

  // Get user information (if there's a specific API for this)
  getUserInfo: async (username: string): Promise<User> => {
    try {
      // Note: Replace with actual API endpoint if available
      const response = await api.get(`/QuanLyNguoiDung/LayThongTinNguoiDung?taiKhoan=${username}`);
      return response.data;
    } catch (error: unknown) {
      // console.error('Get user info error:', error);
      throw new Error('Không thể lấy thông tin người dùng');
    }
  },
};