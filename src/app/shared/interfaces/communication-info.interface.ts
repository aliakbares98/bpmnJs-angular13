export interface ContactPerson {
  ContactId: number;
  ContactTitle: string;
  CrmContactName: string;
  Id: number;
  Model: string;
  KeyId: number;
  Status: 'قطعي';
  StatusCode: number;
  TitleType_GroupValueId: number;
}

export interface Address {
  AddressLine1: string;
  AddressTypeId: number;
  AddressTypeName: string;
  CityAreaId: number;
  CityAreaName: string;
  CityId: number;
  CityName: string;
  ClientId: string;
  GLNCode: string;
  Id: number;
  Model: string;
  IsDefault: true;
  KeyId: number;
  Latitude: string;
  Longitude: string;
  PhoneNumber: AddressPhoneNumber[];
  PostalCode: string;
  ProvinceId: number;
  ProvinceName: string;
}
export interface AddressPhoneNumber {
  ClientId: string;
  ContactAddressId: number;
  Id: number;
  Model: string;
  KeyId: number;
  MasterId: string;
  Number: string;
  PhoneTypeId: number;
  PhoneTypeName: string;
  PreCode: string;
}
export interface PhoneNumber {
  Id: number;
  Model: string;
  KeyId: number;
  Number: string;
  PreCode: string;
}
export interface OtherAddress {
  Address: string;
  AddressTypeId: number;
  Id: number;
  Model: string;
  KeyId: number;
  clientId: string;
}
