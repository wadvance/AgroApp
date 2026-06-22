import Weather from "../models/Weather";

export class WeatherService {
  // Get all weather records
  static async getAllWeather() {
    return await Weather.find().sort({ date: -1 });
  }

  // Get weather by ID
  static async getWeatherById(id: string) {
    return await Weather.findById(id);
  }

  // Create a new weather record
  static async createWeather(weatherData: any) {
    const weather = new Weather(weatherData);
    return await weather.save();
  }

  // Update weather by ID
  static async updateWeather(id: string, weatherData: any) {
    return await Weather.findByIdAndUpdate(id, weatherData, { new: true });
  }

  // Delete weather by ID
  static async deleteWeather(id: string) {
    return await Weather.findByIdAndDelete(id);
  }

  // Get weather by location
  static async getWeatherByLocation(location: string) {
    return await Weather.findOne({ location }).sort({ date: -1 });
  }

  // Get weather history for a location
  static async getWeatherHistory(location: string, limit: number = 10) {
    return await Weather.find({ location }).sort({ date: -1 }).limit(limit);
  }
}