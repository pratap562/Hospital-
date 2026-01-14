import { Router } from "express";
import { 
  getTodaysAppointments, 
  getAppointmentById, 
  checkInAppointment 
} from "../controllers/appointmentController";
import { authMiddleware, roleMiddleware } from "../middleware/authMiddleware";

const router = Router();

// Receptionist and Admin access
router.get("/today", authMiddleware, roleMiddleware(["receptionist", "admin"]), getTodaysAppointments);
router.get("/:appointmentId", authMiddleware, roleMiddleware(["receptionist", "admin"]), getAppointmentById);
router.patch("/:appointmentId/check-in", authMiddleware, roleMiddleware(["receptionist", "admin"]), checkInAppointment);

export default router;
