import axios from "@/helper/AxiosHelper";

const login = async (account, password) => {
  const response = await axios.post("/members/login", {
    account,
    password,
  });

  const result = response.data.result;

  return {
    id: result.id,
    avatarId: result.avatar_id,
    name: result.name,
    email: result.email,
    phone: result.phone,
    isEmailVerified: result.is_email_verified,
    isSmsVerified: result.is_sms_verified,
    jwt: result.jwt,
  };
};

const sendEmailVerificationCode = async () => {
  const response = await axios.post("/members/email/verification-code/send");

  return response.data.success;
};

const verifyEmail = async code => {
  const response = await axios.post("/members/register/email/verify", {
    code,
  });

  return response.data.success;
};

const verifyPhone = async (phone, code) => {
  const response = await axios.post("/members/register/phone/verify", {
    phone,
    code,
  });

  const success = response.data.success;

  const result = response.data.result;

  return {
    success,
    result,
  };
};

const register = async (avatar, name, email, gender, age, password) => {
  const response = await axios.post("/members/register", {
    avatar_id: avatar,
    name,
    email,
    gender,
    age,
    password,
  });

  const result = response.data.result;

  return {
    id: result.id,
    avatarId: result.avatar_id,
    name: result.name,
    email: result.email,
    isSmsVerified: result.is_sms_verified,
    jwt: result.jwt,
  };
};

const me = async () => {
  const response = await axios.get("/members/me");

  const result = response.data.result;

  return {
    id: result.id,
    name: result.name,
    email: result.email,
    phone: result.phone,
    avatarId: result.avatar_id,
    isEmailVerified: result.is_email_verified,
    isSmsVerified: result.is_sms_verified,
  };
};

const details = async memberId => {
  const response = await axios.get(`/members/${memberId}`);

  const result = response.data.result;

  return {
    id: result.id,
    name: result.name,
    email: result.email,
    phone: result.phone,
    avatarId: result.avatar_id,
    isSmsVerified: result.is_sms_verified,
  };
};

const sendPhoneVerificationCode = async ({ captchaToken, phone, locale }) => {
  const response = await axios.post(
    "/members/phone/verification-code/send",
    {
      captcha_token: captchaToken,
      phone,
    },
    {
      headers: {
        "Accept-Language": locale,
      },
    },
  );

  const success = response.data.success;

  return success;
};

const update = async (id, input) => {
  const data = {
    password: input.password != "" ? input.password : undefined,
  };

  const response = await axios.patch(`/members/${id}`, data);

  return response.data.success;
};

const sendForgotPasswordEmail = async email => {
  const response = await axios.post("/members/forgot-password/send", {
    email,
  });

  const success = response.data.success;

  return success;
};

const changePassword = async (token, newPassword) => {
  const response = await axios.post("/members/forgot-password/change-password", {
    token,
    new_password: newPassword,
  });

  const success = response.data.success;

  return success;
};

const checkSmsVerificationStatus = async () => {
  const response = await axios.get("/members/sms-verification-status");

  const result = response.data.result;

  return {
    isSmsVerified: result.is_sms_verified,
  };
};

export const MemberApi = {
  login,
  sendEmailVerificationCode,
  verifyEmail,
  verifyPhone,
  register,
  me,
  details,
  sendPhoneVerificationCode,
  update,
  sendForgotPasswordEmail,
  changePassword,
  checkSmsVerificationStatus,
};
