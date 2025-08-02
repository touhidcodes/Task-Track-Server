import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { assignmentServices } from "./assignment.service";
import {
  assignmentFilterableFields,
  assignmentPaginationFields,
} from "./assignment.constants";
import queryFilters from "../../utils/queryFilters";

// Create a new assignment (Instructor only)
const createAssignment = catchAsync(async (req, res) => {
  const assignmentData = req.body;
  assignmentData.instructorId = req.user.userId;

  const result = await assignmentServices.createAssignment(assignmentData);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Assignment created successfully!",
    data: result,
  });
});

// Get all assignments (for instructors and students)
const getAllAssignments = catchAsync(async (req, res) => {
  const options = queryFilters(
    req.query,
    assignmentFilterableFields,
    assignmentPaginationFields
  );

  const result = await assignmentServices.getAllAssignments(options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All assignments retrieved successfully!",
    data: result,
  });
});

// Get single assignment by ID
const getAssignmentById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await assignmentServices.getAssignmentById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Assignment retrieved successfully!",
    data: result,
  });
});

// Update assignment (Instructor only)
const updateAssignment = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const result = await assignmentServices.updateAssignment(id, updateData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Assignment updated successfully!",
    data: result,
  });
});

// Soft delete assignment (Instructor only)
const deleteAssignment = catchAsync(async (req, res) => {
  const { id } = req.params;

  await assignmentServices.deleteAssignment(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Assignment deleted successfully!",
    data: null,
  });
});

export const assignmentControllers = {
  createAssignment,
  getAllAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
};
