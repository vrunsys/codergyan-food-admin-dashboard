import type { User } from "~/store/userSlice";

const usePermissions = () => {
  const allowed = ['ADMIN', 'manager'];
  const isAllowed = (user: User ) => {
    return allowed.includes(user.role);
  };

  return { isAllowed };
};

export default usePermissions;