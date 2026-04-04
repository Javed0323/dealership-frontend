// features/auth/api.ts
import api from "@/shared/api/axios";

export const loginRequest = async (
  username: string,
  password: string,
  recaptchaToken?: string,
) => {
  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("password", password);

  if (recaptchaToken) {
    formData.append("recaptcha_token", recaptchaToken);
  }

  const res = await api.post("/auth/login", formData);
  return res.data;
};
