
import { SectorType, RouteOffer } from './types';

export const SECTOR_TEMPLATES = {
  [SectorType.FARMA]: {
    color: 'bg-blue-600',
    icon: '💊',
    requirements: ['ATP Refrigerado', 'Certificado GDP', 'Disponibilidad L-D'],
    tag: 'Pharma Ready'
  },
  [SectorType.SALUD]: {
    color: 'bg-purple-600',
    icon: '🧬',
    requirements: ['Vehículo frío', 'Protocolo clínico'],
    tag: 'Clínico/Fertilidad'
  },
  [SectorType.ALIMENTACION]: {
    color: 'bg-green-600',
    icon: '🍎',
    requirements: ['Control temperatura', 'Manipulador'],
    tag: 'Food Delivery'
  }
};

export const INITIAL_OFFERS: RouteOffer[] = [
  {
    id: '1',
    title: 'Reparto Comida AMB',
    sector: SectorType.ALIMENTACION,
    zone: 'Área Metropolitana de Barcelona',
    schedule: 'Turnos rotativos (Mañana/Tarde)',
    requiresCold: true,
    requirements: ['Furgón', 'Control de frío', 'Experiencia urbana'],
    description: 'Distribución capilar de alimentación fresca en toda el área metropolitana.'
  },
  {
    id: '2',
    title: 'Clínica Fertilidad Peninsular',
    sector: SectorType.SALUD,
    zone: 'Toda la Península (Ruta Nacional)',
    schedule: 'Horario flexible / Larga distancia',
    requiresCold: true,
    requirements: ['Refrigerado', 'Protocolo clínico', 'Disponibilidad viaje'],
    description: 'Transporte crítico de muestras biológicas con cobertura nacional.'
  },
  {
    id: '3',
    title: 'Ruta Farma Sant Boi',
    sector: SectorType.FARMA,
    zone: 'Sant Boi de Llobregat',
    schedule: '06:00 - 14:00',
    requiresCold: true,
    requirements: ['ATP Frío', 'Furgoneta ligera', 'Certificado GDP'],
    description: 'Suministro diario a red de farmacias locales en Sant Boi.'
  },
  {
    id: '4',
    title: 'Ruta Farma Barberà',
    sector: SectorType.FARMA,
    zone: 'Barberà del Vallès',
    schedule: '07:30 - 15:30',
    requiresCold: true,
    requirements: ['Vehículo refrigerado', 'Proximidad Vallès', 'Autónomo'],
    description: 'Distribución farmacéutica fija en Barberà y municipios colindantes.'
  },
  {
    id: '5',
    title: 'Rutas Varias Barcelona',
    sector: SectorType.GENERAL,
    zone: 'Barcelona Ciudad (Varios Centros)',
    schedule: 'Varias opciones',
    requiresCold: false,
    requirements: ['Furgón 3.5t', 'Sin frío OK', 'Papeles al día'],
    description: 'Apoyo logístico multisectorial en nuestros diversos nodos de BCN.'
  }
];

export const MARKETING_KITS = {
  farma: {
    whatsapp: "💊 Rutas estables de Farmacia y Salud en BCN. Pago mensual por factura. Sant Boi, Barberà y más. Regístrate aquí: [URL]",
    linkedin: "Buscamos autónomos con furgón (frío y sin frío) para rutas fijas en Barcelona y Nacional. Pago mensual garantizado. #Logistica #Barcelona #Transporte",
  }
};
