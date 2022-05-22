export interface Login {
  UserName: string;
  Password: string;
}
export interface TokenInfo {
  User: string;
  aud: string;
  exp: number;
  iat: number;
  iss: string;
  nbf: number;
}
