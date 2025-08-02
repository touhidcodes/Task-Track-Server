import { Prisma, Submission } from "@prisma/client";
import prisma from "../../utils/prisma";
import APIError from "../../errors/APIError";
import httpStatus from "http-status";
import { paginationHelper } from "../../utils/paginationHelpers";
import { TSubmissionQueryFilter } from "./submission.interface";

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

// Get all submissions with filters (search by student username/email)
const getAllSubmissions = async (options: TSubmissionQueryFilter) => {
  const { filters, pagination } = options;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(pagination);

  const andConditions: Prisma.SubmissionWhereInput[] = [];

  // Optional search term (student username/email)
  if (filters?.searchTerm) {
    andConditions.push({
      OR: [
        {
          student: {
            username: { contains: filters.searchTerm, mode: "insensitive" },
          },
        },
        {
          student: {
            email: { contains: filters.searchTerm, mode: "insensitive" },
          },
        },
      ],
    });
  }

  // Filter by status (PENDING, APPROVED, REJECTED)
  if (filters?.status) {
    andConditions.push({
      status: filters.status as Prisma.EnumStatusFilter,
    });
  }

  const whereConditions: Prisma.SubmissionWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  // Fetch submissions
  const result = await prisma.submission.findMany({
    where: whereConditions,
    select: {
      id: true,
      submissionUrl: true,
      note: true,
      status: true,
      feedback: true,
      createdAt: true,
      updatedAt: true,
      student: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
      assignment: {
        select: {
          id: true,
          title: true,
        },
      },
    },
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: "desc" },
  });

  // Total count
  const total = await prisma.submission.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
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

const getSubmissionStatusCounts = async () => {
  const counts = await prisma.submission.groupBy({
    by: ["status"],
    _count: { status: true },
  });

  // Convert groupBy result into desired shape
  const result = {
    pending: 0,
    accepted: 0,
    rejected: 0,
  };

  counts.forEach((item) => {
    if (item.status === "PENDING") result.pending = item._count.status;
    if (item.status === "ACCEPTED") result.accepted = item._count.status;
    if (item.status === "REJECTED") result.rejected = item._count.status;
  });

  return result;
};

export const submissionServices = {
  createSubmission,
  getAllSubmissions,
  getSubmissionById,
  updateSubmission,
  deleteSubmission,
  getSubmissionStatusCounts,
};
