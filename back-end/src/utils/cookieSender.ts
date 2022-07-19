import { Response } from "express";
interface coockieSenderProps {
  res: Response;
  accessToken: string;
  refreshToken: string;
}

const coockieSender = async ({
  res,
  accessToken,
  refreshToken,
}: coockieSenderProps) => {
  try {
    res.cookie("access-token", accessToken, {
      signed: false,
      maxAge: 60 * 60 * 24, // 15 minutes
      httpOnly: false,
      sameSite: "none",
      secure: true,
    });
    res.cookie("refresh-token", refreshToken, {
      signed: false,
      maxAge: 60 * 60 * 24 * 7, // 7 days
      httpOnly: false,
      secure: true,
      sameSite: "none",
    });
    return true;
  } catch {
    return false;
  }
};

export default coockieSender;
