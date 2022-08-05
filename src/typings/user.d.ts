declare namespace User {
  type UserTableData = {
    name: string;
    email: string;
    identity: string; // 管理员、创建者、组员
    isManager: boolean;
    isValid: boolean;
    isCreator: boolean;
  };
}
