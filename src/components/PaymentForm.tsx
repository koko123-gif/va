import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { generateKodeUnik, calculateTotalPembayaran } from '../utils/paymentUtils';
import { Receipt } from 'lucide-react';

interface PaymentFormProps {
  onPaymentCreated: (paymentData: PaymentData) => void;
}

export interface PaymentData {
  id: string;
  nama_warga: string;
  nominal_dasar: number;
  kode_unik: number;
  total_pembayaran: number;
}

export function PaymentForm({ onPaymentCreated }: PaymentFormProps) {
  const [namaWarga, setNamaWarga] = useState('');
  const [nominalDasar, setNominalDasar] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const nominal = parseInt(nominalDasar);

      if (isNaN(nominal) || nominal <= 0) {
        setError('Nominal harus berupa angka positif');
        setLoading(false);
        return;
      }

      const kodeUnik = generateKodeUnik();
      const totalPembayaran = calculateTotalPembayaran(nominal, kodeUnik);

      const { data, error: insertError } = await supabase
        .from('payments')
        .insert([
          {
            nama_warga: namaWarga,
            nominal_dasar: nominal,
            kode_unik: kodeUnik,
            total_pembayaran: totalPembayaran,
            status: 'pending',
          },
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      if (data) {
        onPaymentCreated(data);
        setNamaWarga('');
        setNominalDasar('');
      }
    } catch (err) {
      setError('Gagal membuat pembayaran. Silakan coba lagi.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md w-full">
      <div className="flex items-center gap-3 mb-6">
        <Receipt className="w-8 h-8 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">Pembayaran Warga</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-2">
            Nama Warga
          </label>
          <input
            id="nama"
            type="text"
            value={namaWarga}
            onChange={(e) => setNamaWarga(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            placeholder="Masukkan nama lengkap"
          />
        </div>

        <div>
          <label htmlFor="nominal" className="block text-sm font-medium text-gray-700 mb-2">
            Nominal Pembayaran
          </label>
          <div className="relative">
            <span className="absolute left-4 top-2.5 text-gray-500">Rp</span>
            <input
              id="nominal"
              type="number"
              value={nominalDasar}
              onChange={(e) => setNominalDasar(e.target.value)}
              required
              min="1"
              className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="100000"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Kode unik akan ditambahkan secara otomatis
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Memproses...' : 'Buat Pembayaran'}
        </button>
      </form>
    </div>
  );
}
