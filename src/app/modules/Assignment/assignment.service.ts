import { Assignment, Prisma } from "@prisma/client";
import prisma from "../../utils/prisma";
import APIError from "../../errors/APIError";
import httpStatus from "http-status";
import { paginationHelper } from "../../utils/paginationHelpers";
import { TAssignmentQueryFilter } from "./assignment.interface";

// Create a new assignment
const createAssignment = async (data: Assignment) => {
  const result = await prisma.assignment.create({
    data: {
      title: data.title,
      description: data.description,
      deadline: data.deadline,
      instructorId: data.instructorId,
    },
    select: {
      id: true,
      title: true,
      description: true,
      deadline: true,
      instructorId: true,
      isAvailable: true,
      createdAt: true,
    },
  });

  return result;
};

// Get all assignments with pagination/filter
const getAllAssignments = async (options: TAssignmentQueryFilter) => {
  const { filters, pagination } = options;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(pagination);

  const andConditions: Prisma.AssignmentWhereInput[] = [];

  // Optional search term
  if (filters?.searchTerm) {
    andConditions.push({
      OR: [
        { title: { contains: filters.searchTerm, mode: "insensitive" } },
        { description: { contains: filters.searchTerm, mode: "insensitive" } },
      ],
    });
  }

  // Filter by instructor
  if (filters?.instructorId) {
    andConditions.push({
      instructorId: filters.instructorId,
    });
  }

  // Filter by availability
  if (filters?.isAvailable) {
    andConditions.push({
      isAvailable: filters.isAvailable === "true",
    });
  }

  // Filter by deleted status (default false)
  const isDeletedQuery = filters?.isDeleted === "true";
  andConditions.push({
    isDeleted: isDeletedQuery,
  });

  const whereConditions: Prisma.AssignmentWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.assignment.findMany({
    where: whereConditions,
    select: {
      id: true,
      title: true,
      description: true,
      deadline: true,
      instructorId: true,
      isAvailable: true,
      createdAt: true,
    },
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: "desc" },
  });

  const total = await prisma.assignment.count({
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

// Get single assignment by ID
const getAssignmentById = async (id: string) => {
  const result = await prisma.assignment.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
    select: {
      id: true,
      title: true,
      description: true,
      deadline: true,
      instructorId: true,
      isAvailable: true,
      createdAt: true,
    },
  });

  return result;
};

// Update assignment
const updateAssignment = async (id: string, data: Partial<Assignment>) => {
  const existingAssignment = await prisma.assignment.findUniqueOrThrow({
    where: { id },
  });

  const result = await prisma.assignment.update({
    where: { id },
    data: {
      title: data.title ?? existingAssignment.title,
      description: data.description ?? existingAssignment.description,
      deadline: data.deadline ?? existingAssignment.deadline,
      isAvailable: data.isAvailable ?? existingAssignment.isAvailable,
    },
    select: {
      id: true,
      title: true,
      description: true,
      deadline: true,
      instructorId: true,
      isAvailable: true,
      createdAt: true,
    },
  });

  return result;
};

// Soft delete assignment
const deleteAssignment = async (id: string) => {
  const existingAssignment = await prisma.assignment.findUnique({
    where: { id },
  });

  if (!existingAssignment) {
    throw new APIError(httpStatus.NOT_FOUND, "Assignment not found!");
  }

  const result = await prisma.assignment.update({
    where: { id },
    data: { isDeleted: true },
    select: {
      id: true,
      title: true,
    },
  });

  return result;
};

export const assignmentServices = {
  createAssignment,
  getAllAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
};
