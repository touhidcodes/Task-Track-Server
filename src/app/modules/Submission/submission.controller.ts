import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { submissionServices } from "./submission.service";

// Create new submission
const createSubmission = catchAsync(async (req, res) => {
  const submissionData = req.body;
  submissionData.studentId = req.user.userId; // Student ID from token

  const result = await submissionServices.createSubmission(submissionData);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Submission created successfully!",
    data: result,
  });
});

// Get all submissions
const getAllSubmissions = catchAsync(async (req, res) => {
  const result = await submissionServices.getAllSubmissions();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Submissions retrieved successfully!",
    data: result,
  });
});

// Get single submission
const getSubmissionById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await submissionServices.getSubmissionById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Submission retrieved successfully!",
    data: result,
  });
});

// Update submission
const updateSubmission = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const result = await submissionServices.updateSubmission(id, updateData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Submission updated successfully!",
    data: result,
  });
});

// Delete submission
const deleteSubmission = catchAsync(async (req, res) => {
  const { id } = req.params;

  await submissionServices.deleteSubmission(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Submission deleted successfully!",
    data: null,
  });
});

export const submissionControllers = {
  createSubmission,
  getAllSubmissions,
  getSubmissionById,
  updateSubmission,
  deleteSubmission,
};
