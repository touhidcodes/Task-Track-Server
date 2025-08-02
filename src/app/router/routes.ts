import express from "express";
import { userRoutes } from "../modules/User/user.route";
import { authRoutes } from "../modules/Auth/auth.route";
import { submissionRoutes } from "../modules/Submission/submission.route";
import { assignmentRoutes } from "../modules/Assignment/assignment.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/",
    route: authRoutes,
  },
  {
    path: "/",
    route: userRoutes,
  },
  {
    path: "/assignments",
    route: assignmentRoutes,
  },
  {
    path: "/submissions",
    route: submissionRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
