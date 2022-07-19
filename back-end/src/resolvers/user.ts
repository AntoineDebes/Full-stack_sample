import emailValidation from "./../utils/emailValidation";
import { jwtCreate } from "../middleware/jwtCreate";
import { User } from "../entities/User";
import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import argon2 from "argon2";
import { config } from "dotenv";
import { UsernamePasswordInput } from "../types/usrPassInp";
import { jwtValidation } from "../middleware/jwtValidation";
import { MyContext } from "../Types";
config();
@ObjectType()
class FieldError {
  @Field()
  field?: "username" | "password";
  @Field()
  message?: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User | any;
}

@Resolver()
export class UserResolver {
  @Mutation(() => Boolean)
  async forgotPassword() {
    // @Ctx() { em, req }: MyContext // @Arg("email") email: string
    // const user = await em.findOne(User,{email})
    return true;
  }

  @Query(() => User)
  async me(@Ctx() { req }: MyContext) {
    const user = await jwtValidation({ req });
    if (user) {
      console.log("user", user);

      return user;
    } else {
      return {
        errors: [{ field: "token", message: "Token didn't refresh" }],
      };
    }
  }

  @Mutation(() => User)
  async register(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { res }: MyContext
  ): Promise<User | Boolean | {}> {
    const { username, email, password } = options;
    if (!!(username && email && password)) {
      email.toLowerCase();
      username.toLowerCase();

      const emailValidationResponse = await emailValidation(email);
      if (!!emailValidationResponse) return emailValidationResponse;

      const hashedPassword = await argon2.hash(password);

      User.create({
        username,
        password: hashedPassword,
        email,
        count: 0,
      });

      const fetchedUser: any = await User.findOne({ where: { email } });
      await jwtCreate({
        user: fetchedUser,
        res,
      });
      // await User.update({where: {id :fetchedUser }}, {});
      return fetchedUser;
    }
    return false;
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { res }: MyContext
  ): Promise<UserResponse> {
    const { username, email, password } = options;
    if (!!((username || email) && password)) {
      let user;
      if (email) {
        user = await User.findOne({
          where: {
            email: email,
          },
        });
      } else if (username) {
        user = await User.findOne({
          where: {
            username: username.toLowerCase(),
          },
        });
      }
      console.log("user: ", user);

      if (!user) {
        return {
          errors: [
            { field: "username", message: "that username doesn't exist" },
          ],
        };
      }
      const validation = await argon2.verify(user.password, password);
      if (!validation) {
        return {
          errors: [{ field: "password", message: "incorrect password" }],
        };
      }
      await jwtCreate({ user, res });
      return {
        user,
      };
    }
    return {
      errors: [{ field: "username", message: "Please fill your data" }],
    };
  }
}
