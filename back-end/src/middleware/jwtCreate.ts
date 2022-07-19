import { Response } from "express";
import coockieSender from "./../utils/cookieSender";
import jwt from "jsonwebtoken";
import { User } from "../entities/User";
import { config } from "dotenv";
config();

interface createTokensProps {
  user: User;
  res: Response;
}

export const jwtCreate = async ({ user, res }: createTokensProps) => {
  try {
    const refreshToken = jwt.sign(
      { id: user.id, count: user.count },
      process.env.REFRESH_TOKEN_SECRET!,
      {
        expiresIn: "7d",
      }
    );
    const accessToken = jwt.sign(
      { id: user.id },
      process.env.ACCESS_TOKEN_SECRET!,
      {
        expiresIn: "15m",
      }
    );
    await coockieSender({
      res,
      accessToken,
      refreshToken,
    });
    user.accessToken = accessToken;
    user.refreshToken = refreshToken;
    return { refreshToken, accessToken };
  } catch (err) {
    console.log("JWT: ", err);
    throw new Error("Something went wrong");
  }
};
