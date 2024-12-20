import User from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "";

export class userService {
  async createUser(data: any) {
    try {
      const { name, email, password } = data;

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
      });
      return newUser;
    } catch (error) {
      console.log(error);
    }
  }

  async loginUser(data: any) {
    try {
      const { email, password } = data;
      const user = await User.findOne({ email });
      if (!user) {
        return "User not found";
      }

      const PassValid = await bcrypt.compare(password, user.password);
      if (!PassValid) {
        return "Invalid credentials";
      }

      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
      return { token: token, user: user };
    } catch (error) {
      console.log(error);
    }
  }
}

export const userServices = new userService();
