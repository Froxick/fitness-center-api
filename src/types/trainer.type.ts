export enum TrainerStatus {
  WORKING = 'WORKING',
  ON_LEAVE = 'ON_LEAVE',
  NOT_WORKING = 'NOT_WORKING',
}

export interface Trainer {
  id: string;
  surname: string;
  name: string;
  patronymic?: string;
  phone: string;
  status: TrainerStatus;
}
