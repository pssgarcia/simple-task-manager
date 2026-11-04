/** Task stored by the in-memory backend. Field names follow the case brief. */
export type Task = {
  id: string;
  titulo: string;
  descricao?: string;
  /** Unix time in milliseconds. */
  dataCriacao: number;
};
