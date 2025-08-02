import { Submission } from "@prisma/client";
import prisma from "../../utils/prisma";
import APIError from "../../errors/APIError";
import httpStatus from "http-status";

// Create new submission
const createSubmission = async (data: Submission) => {
  // Check assignment deadline before submission
  const assignment = await prisma.assignment.findUniqueOrThrow({
    where: { id: data.assignmentId },
    select: { deadline: true },
  });

  if (assignment.deadline < new Date()) {
    throw new APIError(
      httpStatus.BAD_REQUEST,
      "Deadline has passed. Cannot submit assignment."
    );
  }

  // Prevent duplicate submissions
  const existingSubmission = await prisma.submission.findUnique({
    where: {
      studentId_assignmentId: {
        studentId: data.studentId,
        assignmentId: data.assignmentId,
      },
    },
  });

  if (existingSubmission) {
    throw new APIError(
      httpStatus.CONFLICT,
      "Submission already exists for this assignment"
    );
  }

  const result = await prisma.submission.create({
    data: {
      submissionUrl: data.submissionUrl,
      note: data.note,
      studentId: data.studentId,
      assignmentId: data.assignmentId,
    },
    select: {
      id: true,
      submissionUrl: true,
      note: true,
      status: true,
      feedback: true,
      studentId: true,
      assignmentId: true,
      createdAt: true,
    },
  });

  return result;
};

// Get all submissions (admin/instructor/student depending on filters)
const getAllSubmissions = async () => {
  const result = await prisma.submission.findMany({
    select: {
      id: true,
      submissionUrl: true,
      note: true,
      status: true,
      feedback: true,
      studentId: true,
      assignmentId: true,
      createdAt: true,
    },

    orderBy: { createdAt: "desc" },
  });

  return result;
};

// Get single submission by ID
const getSubmissionById = async (id: string) => {
  const result = await prisma.submission.findUniqueOrThrow({
    where: { id },
    select: {
      id: true,
      submissionUrl: true,
      note: true,
      status: true,
      feedback: true,
      studentId: true,
      assignmentId: true,
      createdAt: true,
    },
  });

  return result;
};

// Update submission (student resubmit / instructor feedback)
const updateSubmission = async (id: string, data: Partial<Submission>) => {
  const existingSubmission = await prisma.submission.findUniqueOrThrow({
    where: { id },
  });

  const result = await prisma.submission.update({
    where: { id },
    data: {
      submissionUrl: data.submissionUrl ?? existingSubmission.submissionUrl,
      note: data.note ?? existingSubmission.note,
      status: data.status ?? existingSubmission.status,
      feedback: data.feedback ?? existingSubmission.feedback,
    },
    select: {
      id: true,
      submissionUrl: true,
      note: true,
      status: true,
      feedback: true,
      updatedAt: true,
    },
  });

  return result;
};

// Delete submission
const deleteSubmission = async (id: string) => {
  const existingSubmission = await prisma.submission.findUnique({
    where: { id },
  });

  if (!existingSubmission) {
    throw new APIError(httpStatus.NOT_FOUND, "Submission not found!");
  }

  const result = await prisma.submission.delete({
    where: { id },
    select: { id: true, submissionUrl: true },
  });

  return result;
};

export const submissionServices = {
  createSubmission,
  getAllSubmissions,
  getSubmissionById,
  updateSubmission,
  deleteSubmission,
};
