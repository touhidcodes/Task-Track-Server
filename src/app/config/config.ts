import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env file
dotenv.config({ path: path.join(process.cwd(), ".env") });

if (!process.env.SUPER_ADMIN_EMAIL) {
  throw new Error(
    "SUPER_ADMIN_EMAIL is not defined in the environment variables"
  );
}

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  jwt: {
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
    access_token_expires_in: process.env.ACCESS_TOKEN_EXPIRES_IN,
    refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
    refresh_token_expires_in: process.env.REFRESH_TOKEN_EXPIRES_IN,
  },
  superAdmin: {
    super_admin_username: process.env.SUPER_ADMIN_USERNAME,
    super_admin_email: process.env.SUPER_ADMIN_EMAIL,
  },
  test: {
    instructor_email: process.env.INSTRUCTOR_EMAIL,
    instructor_username: process.env.INSTRUCTOR_USERNAME,
    instructor_password: process.env.INSTRUCTOR_PASSWORD,
    student_username: process.env.STUDENT_USERNAME,
    student_email: process.env.STUDENT_EMAIL,
    student_password: process.env.STUDENT_PASSWORD,
  },
  client: {
    client_url: process.env.CLIENT_URL,
  },

  //Here add your other environment variables
};
