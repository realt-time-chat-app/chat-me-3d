export interface User {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
}

export interface CreateUserResponse {
  result?: {
    id: string;
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
  };
  error?: string;
}

export interface GetUserResponse {
  result?: {
    id: string;
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
  };
  error?: string;
}
