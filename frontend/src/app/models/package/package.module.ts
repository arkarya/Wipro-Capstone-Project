export interface Package {
  id: number;
  name : string;
  type : string;
  destination : string;
  country : string;
  price: number;
  duration_days : number;
  start_date : String;
  description : Text;
  total_slots : number;
  available_slots : number;
  image_url1 : string;
  image_url2 : string;
  image_url3 : string
}
