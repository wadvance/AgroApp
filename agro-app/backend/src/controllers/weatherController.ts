import { Request, Response } from 'express';
import WeatherService from '../services/weatherService';

export class WeatherController {
  // Get all weather records
  static async getAllWeather(req: Request, res: Response) {
    try {
      const weather = await WeatherService.getAllWeather();
      res.status(200).json(weather);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving weather data', error: error.message });
    }
  }

  // Get weather by ID
  static async getWeatherById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const weather = await WeatherService.getWeatherById(id);
      if (!weather) {
        return res.status(404).json({ message: 'Weather record not found' });
      }
      res.status(200).json(weather);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving weather record', error: error.message });
    }
  }

  // Create a new weather record
  static async createWeather(req: Request, res: Response) {
    try {
      const weather = await WeatherService.createWeather(req.body);
      res.status(201).json(weather);
    } catch (error) {
      res.status(400).json({ message: 'Error creating weather record', error: error.message });
    }
  }

  // Update weather by ID
  static async updateWeather(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const weather = await WeatherService.updateWeather(id, req.body);
      if (!weather) {
        return res.status(404).json({ message: 'Weather record not found' });
      }
      res.status(200).json(weather);
    } catch (error) {
      res.status(400).json({ message: 'Error updating weather record', error: error.message });
    }
  }

  // Delete weather by ID
  static async deleteWeather(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const weather = await WeatherService.deleteWeather(id);
      if (!weather) {
        return res.status(404).json({ message: 'Weather record not found' });
      }
      res.status(200).json({ message: 'Weather record deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting weather record', error: error.message });
    }
  }

  // Get weather by location
  static async getWeatherByLocation(req: Request, res: Response) {
    try {
      const { location } = req.params;
      const weather = await WeatherService.getWeatherByLocation(location);
      if (!weather) {
        return res.status(404).json({ message: 'Weather data not found for location' });
      }
      res.status(200).json(weather);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving weather by location', error: error.message });
    }
  }

  // Get weather history for location
  static async getWeatherHistory(req: Request, res: Response) {
    try {
      const { location, limit } = req.query;
      if (!location) {
        return res.status(400).json({ message: 'Location is required' });
      }
      const history = await WeatherService.getWeatherHistory(location as string, limit ? parseInt(limit as string) : 10);
      res.status(200).json(history);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving weather history', error: error.message });
    }
  }
}
