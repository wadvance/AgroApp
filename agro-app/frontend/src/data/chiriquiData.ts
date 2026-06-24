// Geographic data for Chiriquí Province, Panama
// Districts (distritos) and their sub-districts (corregimientos) with approximate GPS coordinates

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Corregimiento {
  id: string;
  name: string;
  coordinates: Coordinates;
  population?: number;
  areaKm2?: number;
}

export interface Distrito {
  id: string;
  name: string;
  coordinates: Coordinates; // Approximate center of the district
  corregimientos: Corregimiento[];
  population?: number;
  areaKm2?: number;
}

export interface Provincia {
  id: string;
  name: string;
  coordinates: Coordinates; // Approximate center of the province
  distritos: Distrito[];
  population?: number;
  areaKm2?: number;
}

// Chiriquí Province data
export const chiriquiProvincia: Provincia = {
  id: "chiriqui",
  name: "Chiriquí",
  coordinates: { lat: 8.4333, lng: -82.4433 }, // Approximate center of Chiriquí
  distritos: [
    {
      id: "david",
      name: "David",
      coordinates: { lat: 8.4328, lng: -82.4269 },
      corregimientos: [
        { id: "david", name: "David", coordinates: { lat: 8.4328, lng: -82.4269 } },
        { id: "boleita", name: "Boquete", coordinates: { lat: 8.7875, lng: -82.4636 } },
        { id: "volta", name: "Volcán", coordinates: { lat: 8.8133, lng: -82.5794 } },
        { id: "guadeloupe", name: "Guadalupe", coordinates: { lat: 8.4567, lng: -82.4123 } },
        { id: "san_jose", name: "San José", coordinates: { lat: 8.4456, lng: -82.4102 } }
      ],
      population: 182541,
      areaKm2: 338.4
    },
    {
      id: "boleita",
      name: "Boquete",
      coordinates: { lat: 8.7875, lng: -82.4636 },
      corregimientos: [
        { id: "boleita-centro", name: "Boquete Centro", coordinates: { lat: 8.7875, lng: -82.4636 } },
        { id: "alto-juana", name: "Alto Jaramillo", coordinates: { lat: 8.8012, lng: -82.4789 } },
        { id: "jorge-rosas", name: "Jorge Roberto Rosas", coordinates: { lat: 8.7989, lng: -82.4567 } },
        { id: "lucha", name: "Lucha", coordinates: { lat: 8.7945, lng: -82.4412 } }
      ],
      population: 20591,
      areaKm2: 487.7
    },
    {
      id: "volcan",
      name: "Volcán",
      coordinates: { lat: 8.8133, lng: -82.5794 },
      corregimientos: [
        { id: "volcan-centro", name: "Volcán", coordinates: { lat: 8.8133, lng: -82.5794 } },
        { id: "respingo", name: "Respingo", coordinates: { lat: 8.8245, lng: -82.5876 } },
        { id: "la-concepcion", name: "La Concepción", coordinates: { lat: 8.8023, lng: -82.5678 } }
      ],
      population: 14193,
      areaKm2: 186.5
    },
    {
      id: "san-lorenzo",
      name: "San Lorenzo",
      coordinates: { lat: 8.2611, lng: -82.1789 },
      corregimientos: [
        { id: "san-lorenzo-centro", name: "San Lorenzo", coordinates: { lat: 8.2611, lng: -82.1789 } },
        { id: "el-espino", name: "El Espino", coordinates: { lat: 8.2745, lng: -82.1901 } },
        { id: "santa-clara", name: "Santa Clara", coordinates: { lat: 8.2534, lng: -82.1656 } }
      ],
      population: 26974,
      areaKm2: 155.2
    },
    {
      id: "san-felix",
      name: "San Félix",
      coordinates: { lat: 8.3689, lng: -82.3456 },
      corregimientos: [
        { id: "san-felix-centro", name: "San Félix", coordinates: { lat: 8.3689, lng: -82.3456 } },
        { id: "los-algarrobos", name: "Los Algarrobos", coordinates: { lat: 8.3812, lng: -82.3567 } },
        { id: "la-concepcion", name: "La Concepción", coordinates: { lat: 8.3543, lng: -82.3321 } }
      ],
      population: 33415,
      areaKm2: 132.1
    },
    {
      id: "concepcion",
      name: "Concepción",
      coordinates: { lat: 8.3678, lng: -82.5123 },
      corregimientos: [
        { id: "concepcion-centro", name: "Concepción", coordinates: { lat: 8.3678, lng: -82.5123 } },
        { id: "lajas", name: "Lajas", coordinates: { lat: 8.3845, lng: -82.5234 } },
        { id: "la-esta", name: "La Estrella", coordinates: { lat: 8.3512, lng: -82.5011 } }
      ],
      population: 8456,
      areaKm2: 105.8
    },
    {
      id: "baru",
      name: "Barú",
      coordinates: { lat: 8.3056, lng: -82.7123 },
      corregimientos: [
        { id: "puerto-armac", name: "Puerto Armuelles", coordinates: { lat: 8.2845, lng: -82.8678 } },
        { id: "boco", name: "Boco", coordinates: { lat: 8.3345, lng: -82.7012 } },
        { id: "riera", name: "Riera", coordinates: { lat: 8.3123, lng: -82.6987 } }
      ],
      population: 42178,
      areaKm2: 544.3
    },
    {
      id: "bugaba",
      name: "Bugaba",
      coordinates: { lat: 8.4123, lng: -82.5678 },
      corregimientos: [
        { id: "bugaba-centro", name: "Bugaba", coordinates: { lat: 8.4123, lng: -82.5678 } },
        { id: "respingo", name: "Respingo", coordinates: { lat: 8.4234, lng: -82.5890 } },
        { id: "rio-sereno", name: "Río Sereno", coordinates: { lat: 8.4567, lng: -82.5345 } }
      ],
      population: 27891,
      areaKm2: 584.6
    },
    {
      id: "tierras-altas",
      name: "Tierras Altas",
      coordinates: { lat: 8.7456, lng: -82.5432 },
      corregimientos: [
        { id: "cerro-punta", name: "Cerro Punta", coordinates: { lat: 8.7654, lng: -82.5678 } },
        { id: "volcan", name: "Volcán", coordinates: { lat: 8.8133, lng: -82.5794 } },
        { id: "san-andres", name: "San Andrés", coordinates: { lat: 8.7234, lng: -82.5210 } }
      ],
      population: 15678,
      areaKm2: 315.2
    }
  ],
  population: 462056,
  areaKm2: 6490.9
};

// Helper functions
export const findDistritoByName = (name: string): Distrito | undefined => {
  return chiriquiProvincia.distritos.find(d => 
    d.name.toLowerCase() === name.toLowerCase() ||
    d.id.toLowerCase() === name.toLowerCase()
  );
};

export const findCorregimientoByName = (distritoId: string, name: string): Corregimiento | undefined => {
  const distrito = chiriquiProvincia.distritos.find(d => d.id === distritoId);
  if (!distrito) return undefined;
  
  return distrito.corregimientos.find(c => 
    c.name.toLowerCase() === name.toLowerCase() ||
    c.id.toLowerCase() === name.toLowerCase()
  );
};

export const findLocationByCoordinates = (lat: number, lng: number, tolerance: number = 0.05): { 
  distrito?: Distrito; 
  corregimiento?: Corregimiento; 
  distance: number;
} => {
  let closestDistrito: Distrito | undefined;
  let closestCorregimiento: Corregimiento | undefined;
  let minDistance = Infinity;

  // Check corregimientos first (more specific)
  for (const distrito of chiriquiProvincia.distritos) {
    for (const corregimiento of distrito.corregimientos) {
      const distance = Math.sqrt(
        Math.pow(corregimiento.coordinates.lat - lat, 2) + 
        Math.pow(corregimiento.coordinates.lng - lng, 2)
      );
      
      if (distance < minDistance && distance <= tolerance) {
        minDistance = distance;
        closestDistrito = distrito;
        closestCorregimiento = corregimiento;
      }
    }
  }
  
  // If no corregimiento found within tolerance, check distritos
  if (!closestDistrito) {
    for (const distrito of chiriquiProvincia.distritos) {
      const distance = Math.sqrt(
        Math.pow(distrito.coordinates.lat - lat, 2) + 
        Math.pow(distrito.coordinates.lng - lng, 2)
      );
      
      if (distance < minDistance && distance <= tolerance) {
        minDistance = distance;
        closestDistrito = distrito;
      }
    }
  }
  
  return {
    distrito: closestDistrito,
    corregimiento: closestCorregimiento,
    distance: minDistance === Infinity ? -1 : minDistance
  };
};

export default chiriquiProvincia;