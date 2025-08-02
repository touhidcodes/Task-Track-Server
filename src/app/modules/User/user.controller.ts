import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";
import { userServices } from "./user.service";

const getUser = catchAsync(async (req, res) => {
  const { userId } = req.user;

  const result = await userServices.getUser(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User profile retrieved successfully!",
    data: result,
  });
});

const getAllUser = catchAsync(async (req, res) => {
  const { email } = req.user;

  const result = await userServices.getAllUser(email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All users profile retrieved successfully!",
    data: result,
  });
});

export const userControllers = {
  getUser,
  getAllUser,
};
