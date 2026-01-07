export enum Role {
  ETUDIANT = 'ETUDIANT',
  INSTRUCTEUR = 'INSTRUCTEUR',
  ADMINISTRATEUR = 'ADMINISTRATEUR'
}

export interface Utilisateur {
  id?: number;
  nom: string;
  prenom: string;
  email: string;
  motDePasse?: string;
  role: Role;
}
