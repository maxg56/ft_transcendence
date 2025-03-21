import UserModel from '../models/user.model';

export default {
  async getAll() {
    return await UserModel.findAll();
  },

  async getById(id: string) {
    return await UserModel.findById(id);
  }
};
