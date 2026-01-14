import { Hospital } from '../models/Hospital';
import { generateNanoId } from '../utils/nanoIdGenerator';

export interface CreateHospitalData {
  name: string;
  city: string;
}

export interface UpdateHospitalData {
  name?: string;
  city?: string;
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Get all hospitals with pagination
 */
export const getAllHospitals = async (options: PaginationOptions): Promise<PaginatedResult<any>> => {
  const { page, limit } = options;
  const skip = (page - 1) * limit;

  const hospitals = await Hospital.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .select('-__v');

  const total = await Hospital.countDocuments();

  return {
    data: hospitals,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get hospital by hospitalId
 */
export const getHospitalByHospitalId = async (hospitalId: string) => {
  const hospital = await Hospital.findOne({ hospitalId }).select('-__v');
  if (!hospital) {
    throw new Error('Hospital not found');
  }
  return hospital;
};

/**
 * Create a new hospital
 */
export const createHospital = async (hospitalData: CreateHospitalData) => {
  const hospitalId = await generateNanoId();

  const hospital = new Hospital({
    hospitalId,
    name: hospitalData.name.trim(),
    city: hospitalData.city.trim(),
  });

  await hospital.save();

  return hospital;
};

/**
 * Update hospital
 */
export const updateHospital = async (hospitalId: string, updateData: UpdateHospitalData) => {
  const updateFields: { name?: string; city?: string } = {};
  if (updateData.name) updateFields.name = updateData.name.trim();
  if (updateData.city) updateFields.city = updateData.city.trim();

  const hospital = await Hospital.findOneAndUpdate(
    { hospitalId },
    updateFields,
    { new: true, runValidators: true }
  ).select('-__v');

  if (!hospital) {
    throw new Error('Hospital not found');
  }

  return hospital;
};

/**
 * Find hospital by hospitalId (returns ObjectId for internal use)
 */
export const findHospitalObjectId = async (hospitalId: string) => {
  const hospital = await Hospital.findOne({ hospitalId });
  if (!hospital) {
    throw new Error('Hospital not found');
  }
  return hospital;
};
