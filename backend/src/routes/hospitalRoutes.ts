import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleMiddleware';
import {
  getAllHospitals,
  createHospital,
  updateHospital,
  getHospitalById,
} from '../controllers/hospitalController';

const router = Router();

// ============================================
// ADMIN ONLY ROUTES
// ============================================
router.use(authMiddleware);

// Get all hospitals (paginated) - Admin only
router.get('/', requireRole(['admin']), getAllHospitals);

// Create hospital - Admin only
router.post('/', requireRole(['admin']), createHospital);

// Get hospital by ID - Admin only
router.get('/:hospitalId', requireRole(['admin']), getHospitalById);

// Update hospital - Admin only
router.put('/:hospitalId', requireRole(['admin']), updateHospital);

// ============================================
// Add other user role routes here (doctor, receptionist, etc.)
// ============================================

export default router;

