export const calculateSisaKuota = (kuotaMaksimal: number, activeBookingsCount: number): number => {
  const sisa = kuotaMaksimal - activeBookingsCount;
  return sisa > 0 ? sisa : 0;
};
