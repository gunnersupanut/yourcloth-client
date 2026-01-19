export interface Address {
  id: number;
  recipient_name: string;
  phone_number: string;
  address_detail: string;
  province: string;
  district: string;
  sub_district: string;
  zip_code: string;
  is_default: boolean;
}

export interface CreateAddressPayload {
  recipientName: string;
  phoneNumber: string;
  province: string;
  district: string;
  subDistrict: string;
  zipCode: string;
  details: string;
  isDefault?: boolean;
}

export interface UpdateAddressPayload {
  recipientName?: string;
  phoneNumber?: string;
  province?: string;
  district?: string;
  subDistrict?: string;
  zipCode?: string;
  addressDetail?: string;
  isDefault?: boolean;
}

export interface AddressFormState {
  recipientName: string;
  phoneNumber: string;
  addressDetail: string;
  province: string;
  district: string;
  subDistrict: string;
  zipCode: string;
  isDefault: boolean;
}