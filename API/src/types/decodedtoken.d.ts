export interface DecodedToken {
  userId: string;
  roles?: string[];
  iat?: number;
  exp?: number;
}
