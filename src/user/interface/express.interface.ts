export {}; // Ensure this file is treated as a module

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    export interface Request {
      user: {
        uid: string;
        role: string;
      };
    }
  }
}
