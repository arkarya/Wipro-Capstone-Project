export interface UserDetails{
  message : string,
  id : number,
  name : string,
  email : string,
  logged : boolean,
  role : string
}

export interface Register{
  name: string,
  email: string,
  phone: string,
  password: string
}