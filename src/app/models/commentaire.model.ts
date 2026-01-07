
// models/commentaire.model.ts
export interface Commentaire {
  id?: number;
  texte: string;
  dateCommentaire?: string;
  auteur?: any;
  auteurId?: number;
  soumission?: any;
  soumissionId?: number;
  cours?: any;
  coursId?: number;
}
