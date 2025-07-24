import { CredentialsSignin } from "next-auth";

export class CustomAuthError extends CredentialsSignin {
  constructor(
    public code: string,
    public message: string
  ) {
    super();
  }
}
