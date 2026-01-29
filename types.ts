
export enum CandidatePath {
  AUTONOMO_COLD = 'AUTONOMO_COLD',
  AUTONOMO_NO_COLD = 'AUTONOMO_NO_COLD',
  ASALARIADO_A_AUTONOMO = 'ASALARIADO_A_AUTONOMO'
}

export enum CandidateStatus {
  PENDING = 'PENDING',
  PRE_APPROVED = 'PRE_APPROVED',
  APPROVED = 'APPROVED',
  ON_ROUTE = 'ON_ROUTE'
}

export enum SectorType {
  FARMA = 'FARMA',
  SALUD = 'SALUD',
  ALIMENTACION = 'ALIMENTACION',
  MENSAGERIA = 'MENSAGERIA',
  RETAIL = 'RETAIL',
  GENERAL = 'GENERAL'
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  path: CandidatePath;
  vehicleModel: string;
  hasRefrigeration: boolean;
  documentsUploaded: string[];
  status: CandidateStatus;
  zone: string;
  referredBy?: string;
  createdAt: number;
}

export interface RouteOffer {
  id: string;
  title: string;
  sector: SectorType;
  zone: string;
  schedule: string;
  requiresCold: boolean;
  requirements: string[];
  description: string;
}
