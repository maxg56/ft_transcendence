export default class UserModel {
    static async findAll() {
      return [{ id: 1, name: 'John Doe' }];
    }
  
    static async findById(id: string) {
      return { id, name: 'John Doe' };
    }
}
  