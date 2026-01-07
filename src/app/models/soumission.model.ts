export interface Soumission {
  id?: number;
  etudiant?: any;
  etudiantId?: number;
  projet?: any;
  projetId?: number;
  dateSoumission?: string;
  fichierUrl: string;
  note?: number;
  commentairesInstructeur?: string;
}
