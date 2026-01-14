import { Router } from "express";
import { 
  createVisit,
  searchVisitByToken,
  getHospitalTodayVisits,
  updateVisitDetails,
  getPatientHistory
} from "../controllers/visitController";
import { authMiddleware, roleMiddleware } from "../middleware/authMiddleware";

const router = Router();

// Universal Check-in access (Receptionist/Admin)
router.post("/", authMiddleware, roleMiddleware(["receptionist", "admin"]), createVisit);

// Doctor Dashboard features
router.get("/search", authMiddleware, roleMiddleware(["doctor", "admin"]), searchVisitByToken);
router.get("/today", authMiddleware, roleMiddleware(["doctor", "admin"]), getHospitalTodayVisits);
router.put("/:visitId", authMiddleware, roleMiddleware(["doctor", "admin"]), updateVisitDetails);
router.get("/patient/:patientId/history", authMiddleware, roleMiddleware(["doctor", "admin"]), getPatientHistory);

export default router;
