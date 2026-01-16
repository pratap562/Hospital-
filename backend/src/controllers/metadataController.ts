import { Request, Response } from "express";
import { Metadata } from "../models/Metadata";

export const getMetadata = async (req: Request, res: Response): Promise<void> => {
  try {
    let metadata = await Metadata.findOne();
    if (!metadata) {
      // Seed initial data if not found
      metadata = await Metadata.create({
        treatments: [
          "Nadi Pariksha",
          "Gastrointestinal Disorder",
          "Prakriti Parikshan",
          "Hair Fall",
          "Hypertension Problems",
          "Respiratory Disorders",
          "Urinary Disorders",
          "Joint Disorders",
          "Skin Disorder",
          "Eczema",
          "Fungal Infection",
          "Acne",
          "Vitiligo",
          "Diabetics",
        ],
        diseases: [
          "Diabetes",
          "Thyroid",
          "Joint Disorder",
          "Skin Disorder",
          "Hypertensions",
          "Digestive Problems",
          "Gynecological Problems",
          "Hair Fall Problems",
        ],
        medicines: [], // Mock data in frontend as mentioned
        symptoms: [
          "Fever",
          "Cough",
          "Cold",
          "Pain",
          "Swelling",
          "Burning Sensation",
          "Itching",
          "Weakness",
        ],
      });
    }
    res.status(200).json({ success: true, data: metadata });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error fetching metadata", error: error.message });
  }
};

export const updateMetadata = async (req: Request, res: Response): Promise<void> => {
  try {
    const { treatments, medicines, diseases, symptoms } = req.body;
    let metadata = await Metadata.findOne();
    
    if (!metadata) {
      metadata = new Metadata({});
    }

    if (treatments) metadata.treatments = treatments;
    if (medicines) metadata.medicines = medicines;
    if (diseases) metadata.diseases = diseases;
    if (symptoms) metadata.symptoms = symptoms;

    await metadata.save();
    res.status(200).json({ success: true, message: "Metadata updated successfully", data: metadata });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Error updating metadata", error: error.message });
  }
};
