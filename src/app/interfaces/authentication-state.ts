export interface AuthenticationState {
  isAuthenticated: boolean;
  token: string;
  error: any;
  tokenSent: boolean
}
