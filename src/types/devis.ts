export type Car = {
  brand: string;
  model: string;
  year: string;
  vin?: string;
  mPoste?: string;
};

export type Client = {
  name: string;
  email: string;
  phone: string;
  car: Car;
};

export type DevisFormData = {
  client: Client;
  services: string[];
};

export type StepInfoErrors = {
  name?: string;
  email?: string;
  phone?: string;
  brand?: string;
  model?: string;
  year?: string;
  vin?: string;
  mPoste?: string;
};

export type StepClientErrors = {
  name?: string;
  email?: string;
  phone?: string;
};

export type StepCarErrors = {
  brand?: string;
  model?: string;
  year?: string;
  vin?: string;
  mPoste?: string;
};

export type StepServicesErrors = {
  services?: string;
};