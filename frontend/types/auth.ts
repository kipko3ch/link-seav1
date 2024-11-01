export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData extends LoginData {
  username: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
} 