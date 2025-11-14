export type LoginResponse = {
  errors?: {
    properties?: {
      email?: string[];
      password?: string[];
    };
  };
  message: string;
  success: boolean;
  redirectTo?: string;
  inputs?: {
    email?: string;
    password?: string;
  };
};

export type SignupResponse = {
  errors?: {
    properties?: {
      name?: string[];
      email?: string[];
      password?: string[];
    };
  };
  message: string;
  success: boolean;
  redirectTo?: string;
  inputs?: {
    name: string;
    email: string;
    password: string;
  };
};

export type SignoutResponse = {
  message: string;
  success: boolean;
  redirectTo?: string;
};

export type SessionType = {
  session: Record<string, any> & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    expiresAt: Date;
    token: string;
    ipAddress?: string | null | undefined;
    userAgent?: string | null | undefined;
  };
  user: Record<string, any> & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    emailVerified: boolean;
    name: string;
    image?: string | null | undefined;
  };
};
