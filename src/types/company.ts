export interface ICompany {
  id: string;
  name: string;
  code: string;
  npwp: string | null;
  address: string | null;
  city: string | null;
  phone: string | null;
  email: string | null;
  logo_url: string | null;
  is_active: boolean;

  office_latitude?: number | null;
  office_longitude?: number | null;
  office_radius_meters?: number;
  work_start_time?: string;
  work_end_time?: string;
  late_tolerance_minutes?: number;
}
