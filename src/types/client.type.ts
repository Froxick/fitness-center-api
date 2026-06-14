export interface Client {
  id: string;
  surname: string;
  name: string;
  patronymic?: string;
  birthday: string;
  phone: string;
  email: string;
  isActive: boolean;
  trainerId?: string;
}
