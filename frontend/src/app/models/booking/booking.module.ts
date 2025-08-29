export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

export interface Booking {
  id?: number;
  user_id : number;
  package_id: number;
  name: string;
  email: string;
  phone: string;
  total_adults: number;
  total_children: number;
  start_date: string;
  status: BookingStatus;
  amt_paid?: number;
}
