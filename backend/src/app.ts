import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes";
import hospitalRoutes from "./routes/hospitalRoutes";
import slotRoutes from "./routes/slotRoutes";
import patientRoutes from "./routes/patientRoutes";
import visitRoutes from "./routes/visitRoutes";
import pharmacistRoutes from "./routes/pharmacistRoutes";
import appointmentRoutes from "./routes/appointmentRoutes";

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Global middlewares
app.use(cors({
  origin: true, // In production, replace with actual allowed origins
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

// Route mounting
app.use("/api/users", userRoutes);
app.use("/api/hospitals", hospitalRoutes);
app.use("/api/slots", slotRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/visits", visitRoutes);
app.use("/api/pharmacists", pharmacistRoutes);
app.use("/api/appointments", appointmentRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
