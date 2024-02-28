export interface StatusResponseDataType {
  title: string;
  description: string;
}

export interface StatusResponseType {
  success?: StatusResponseDataType;
  error?: StatusResponseDataType;
}
