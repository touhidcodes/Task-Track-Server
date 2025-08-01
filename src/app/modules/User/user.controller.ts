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

const getUserProfile = catchAsync(async (req, res) => {
  const { userId } = req.user;

  const result = await userServices.getUserProfile(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User profile retrieved successfully!",
    data: result,
  });
});

const getUserWithProfile = catchAsync(async (req, res) => {
  const { userId } = req.user;

  const result = await userServices.getUserWithProfile(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User profile retrieved successfully!",
    data: result,
  });
});

const updateUser = catchAsync(async (req, res) => {
  const { userId } = req.user;

  const result = await userServices.updateUser(userId, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User profile updated successfully!",
    data: result,
  });
});

const updateUserStatus = catchAsync(async (req, res) => {
  const { userId } = req.params;

  const result = await userServices.updateUserStatus(userId, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User status updated successfully!",
    data: result,
  });
});

export const userControllers = {
  getUser,
  updateUser,
  getUserProfile,
  getUserWithProfile,
  getAllUser,
  updateUserStatus,
};
