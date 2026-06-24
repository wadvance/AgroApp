import Seed from "../models/Seed.js";

export class SeedService {
  // Get all seeds
  static async getAllSeeds() {
    return await Seed.find();
  }

  // Get seed by ID
  static async getSeedById(id: string) {
    return await Seed.findById(id);
  }

  // Create a new seed
  static async createSeed(seedData: any) {
    const seed = new Seed(seedData);
    return await seed.save();
  }

  // Update seed by ID
  static async updateSeed(id: string, seedData: any) {
    return await Seed.findByIdAndUpdate(id, seedData, { new: true });
  }

  // Delete seed by ID
  static async deleteSeed(id: string) {
    return await Seed.findByIdAndDelete(id);
  }

  // Search seeds by name or type
  static async searchSeeds(query: string) {
    return await Seed.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { type: { $regex: query, $options: "i" } },
        { scientificName: { $regex: query, $options: "i" } }
      ]
    });
  }
}