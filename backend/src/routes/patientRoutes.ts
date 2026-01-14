import { Router } from "express";
import { 
  getPatientById, 
  createPatient,
  listPatients
} from "../controllers/patientController";
import { authMiddleware, roleMiddleware } from "../middleware/authMiddleware";

const router = Router();

// Receptionist and Admin access
router.get("/:patientId", authMiddleware, roleMiddleware(["receptionist", "admin"]), getPatientById);
router.post("/", authMiddleware, roleMiddleware(["receptionist", "admin"]), createPatient);
router.get("/", authMiddleware, roleMiddleware(["doctor", "admin"]), listPatients);

export default router;
