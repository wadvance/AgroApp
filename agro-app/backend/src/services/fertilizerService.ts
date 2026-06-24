import Fertilizer from "../models/Fertilizer.js";

export class FertilizerService {
  // Get all fertilizers
  static async getAllFertilizers() {
    return await Fertilizer.find();
  }

  // Get fertilizer by ID
  static async getFertilizerById(id: string) {
    return await Fertilizer.findById(id);
  }

  // Create a new fertilizer
  static async createFertilizer(fertilizerData: any) {
    const fertilizer = new Fertilizer(fertilizerData);
    return await fertilizer.save();
  }

  // Update fertilizer by ID
  static async updateFertilizer(id: string, fertilizerData: any) {
    return await Fertilizer.findByIdAndUpdate(id, fertilizerData, { new: true });
  }

  // Delete fertilizer by ID
  static async deleteFertilizer(id: string) {
    return await Fertilizer.findByIdAndDelete(id);
  }

  // Search fertilizers by name or type
  static async searchFertilizers(query: string) {
    return await Fertilizer.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { type: { $regex: query, $options: "i" } }
      ]
    });
  }

  // Get fertilizers suitable for a specific crop
  static async getFertilizersForCrop(crop: string) {
    return await Fertilizer.find({ suitableFor: { $in: [crop] } });
  }
}