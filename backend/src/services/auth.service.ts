import { User } from "../models/user.model";
import { ApiError } from "../utils/apiError";

interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
}

export const registerUserService = async ({
  // get the data from controller
  fullName,
  email,
  password,
}: RegisterPayload) => {
  // check if the user already exists or not
  const existingUser = await User.findOne({ email: email });
  // if user exists throw error
  if (existingUser) {
    throw new ApiError(409, "User with email already exists");
  }
  // create the user document in mongo
  const user = await User.create({
    fullName,
    email,
    password,
  });
  // return the response
  return user;
};
