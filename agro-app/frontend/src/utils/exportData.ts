export const exportToCSV = (data: Record<string, any>[], filename: string, columns?: Record<string, string>) => {
  if (!data.length) return;

  const headers = columns || Object.keys(data[0]).reduce((acc, key) => ({ ...acc, [key]: key }), {});
  const headerRow = Object.values(headers).join(',');
  const rows = data.map(item =>
    Object.keys(headers).map(key => {
      const val = item[key];
      if (val === null || val === undefined) return '';
      const str = String(val);
      return str.includes(',') || str.includes('"') || str.includes('\n')
        ? `"${str.replace(/"/g, '""')}"`
        : str;
    }).join(',')
  );

  const csv = [headerRow, ...rows].join('\n');
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportCropsToCSV = (crops: any[]) => {
  const columns: Record<string, string> = {
    name: 'Nombre',
    cropVariety: 'Variedad',
    area: 'Área',
    areaUnit: 'Unidad área',
    irrigationSystem: 'Sistema riego',
    soilType: 'Tipo suelo',
    sowingDate: 'Fecha siembra',
    status: 'Estado',
    plantingFrame: 'Marco plantación',
    crownDiameter: 'Diámetro copa (cm)',
    location: 'Ubicación',
    notes: 'Notas',
  };

  const mapped = crops.map(c => ({
    name: c.name,
    cropVariety: c.cropVariety,
    area: c.area,
    areaUnit: c.areaUnit,
    irrigationSystem: c.irrigationSystem,
    soilType: c.soilType,
    sowingDate: c.sowingDate ? new Date(c.sowingDate).toLocaleDateString('es-ES') : '',
    status: c.status,
    plantingFrame: c.plantingFrame || '',
    crownDiameter: c.crownDiameter || '',
    location: c.location?.address || '',
    notes: c.notes || '',
  }));

  exportToCSV(mapped, 'cultivos', columns);
};

export const exportIrrigationsToCSV = (irrigations: any[], cropName: string) => {
  const columns: Record<string, string> = {
    date: 'Fecha',
    amount: 'Cantidad',
    unit: 'Unidad',
    method: 'Método',
    notes: 'Notas',
  };

  const mapped = irrigations.map(ir => ({
    date: ir.date ? new Date(ir.date).toLocaleDateString('es-ES') : '',
    amount: ir.amount,
    unit: ir.unit || 'mm',
    method: ir.method || '',
    notes: ir.notes || '',
  }));

  exportToCSV(mapped, `riegos_${cropName.replace(/\s+/g, '_')}`, columns);
};

export const exportSeedsToCSV = (seeds: any[]) => {
  const columns: Record<string, string> = {
    name: 'Nombre',
    scientificName: 'Nombre científico',
    type: 'Tipo',
    color: 'Color',
    size: 'Tamaño',
    seasons: 'Temporada',
    spacing: 'Espaciado',
    soil: 'Suelo',
    daysToMaturity: 'Madurez',
  };

  const mapped = seeds.map(s => ({
    name: s.name,
    scientificName: s.scientificName,
    type: s.type,
    color: s.color,
    size: s.size,
    seasons: s.planting?.season || '',
    spacing: s.planting?.spacing || '',
    soil: s.planting?.soil || '',
    daysToMaturity: s.harvest?.daysToMaturity || '',
  }));

  exportToCSV(mapped, 'semillas', columns);
};
