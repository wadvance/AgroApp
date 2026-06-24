import Disease from "../models/Disease.js";

export class DiseaseService {
  // Get all diseases
  static async getAllDiseases() {
    return await Disease.find();
  }

  // Get disease by ID
  static async getDiseaseById(id: string) {
    return await Disease.findById(id);
  }

  // Create a new disease
  static async createDisease(diseaseData: any) {
    const disease = new Disease(diseaseData);
    return await disease.save();
  }

  // Update disease by ID
  static async updateDisease(id: string, diseaseData: any) {
    return await Disease.findByIdAndUpdate(id, diseaseData, { new: true });
  }

  // Delete disease by ID
  static async deleteDisease(id: string) {
    return await Disease.findByIdAndDelete(id);
  }

  // Search diseases by name or affected plants
  static async searchDiseases(query: string) {
    return await Disease.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { affectedPlants: { $regex: query, $options: "i" } }
      ]
    });
  }

  // Get diseases by affected plant
  static async getDiseasesByPlant(plant: string) {
    return await Disease.find({ affectedPlants: { $in: [plant] } });
  }
}