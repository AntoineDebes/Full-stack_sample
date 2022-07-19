import jwt from "jsonwebtoken";
import { User } from "../entities/User";
import { jwtCreate } from "./jwtCreate";

export const jwtValidation = async ({ req, res, em }: any) => {
  const refreshToken = req.cookies["refresh-token"];
  const accessToken = req.cookies["access-token"];
  if (!refreshToken && !accessToken) return null;
  try {
    const accessTokenData: any = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET!
    );
    if (accessTokenData) {
      const user = await User.findOne({ where: { id: accessTokenData.id } });
      return user;
    }
  } catch {}

  if (!refreshToken) return null;

  const refreshTokenData: any = jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET!
  );

  if (!refreshTokenData) return null;

  const user = await em.findOne(User, { id: refreshTokenData.id });

  if (!user || user.count !== refreshTokenData.count) return null;
  user.count += 1;
  await jwtCreate({ user, res });

  await em.persistAndFlush(user);

  return user;
};
