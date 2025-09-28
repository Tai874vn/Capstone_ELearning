import api from './api';
import type { UpdateUserRequest } from '../types/Index';

export const userService = {
  // Update user information
  updateUserInfo: async (userData: UpdateUserRequest): Promise<any> => {
    try {
      const response = await api.put('/QuanLyNguoiDung/CapNhatThongTinNguoiDung', userData);
      return response.data;
    } catch (error: any) {
      console.error('Update user info error:', error);

      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.response?.data) {
        throw new Error('Cập nhật thông tin thất bại');
      } else {
        throw new Error('Lỗi kết nối. Vui lòng thử lại.');
      }
    }
  },

  // Get user information (if there's a specific API for this)
  getUserInfo: async (username: string): Promise<any> => {
    try {
      // Note: Replace with actual API endpoint if available
      const response = await api.get(`/QuanLyNguoiDung/LayThongTinNguoiDung?taiKhoan=${username}`);
      return response.data;
    } catch (error: any) {
      console.error('Get user info error:', error);
      throw new Error('Không thể lấy thông tin người dùng');
    }
  },
};