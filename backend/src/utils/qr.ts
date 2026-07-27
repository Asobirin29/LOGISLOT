import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

export const generateQRCode = (): string => {
  return uuidv4();
};

export const isValidQRCode = (qrCode: string): boolean => {
  return uuidValidate(qrCode);
};
