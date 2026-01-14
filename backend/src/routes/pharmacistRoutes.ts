import { Router } from "express";

const router = Router();

// TODO: add pharmacist routes
router.get("/", (_req, res) => {
  res.send("Pharmacist routes not implemented yet");
});

export default router;
