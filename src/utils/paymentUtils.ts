export const generateKodeUnik = (): number => {
  return Math.floor(Math.random() * 900) + 100;
};

export const calculateTotalPembayaran = (nominalDasar: number, kodeUnik: number): number => {
  return nominalDasar + kodeUnik;
};

export const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};
