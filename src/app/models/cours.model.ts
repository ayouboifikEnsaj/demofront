
// models/cours.model.ts
export interface Cours {
  id?: number;
  titre: string;
  description: string;
  code: string;
  instructeur?: any;
  instructeurId?: number;
}
