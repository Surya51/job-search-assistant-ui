export interface ErrorResponse {
  success?: boolean;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error?: any;

  status?: number;

  noToken?: boolean;
}