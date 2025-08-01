import { UserRole } from "@prisma/client";

export type TUserData = {
  username: string;
  email: string;
  role: UserRole;
  password: string;
};
