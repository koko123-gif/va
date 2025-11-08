import { formatRupiah } from '../utils/paymentUtils';
import { CheckCircle, Copy, AlertCircle } from 'lucide-react';
import { PaymentData } from './PaymentForm';
import { useState, useEffect } from 'react';

interface PaymentDisplayProps {
  payment: PaymentData;
  onNewPayment: () => void;
}

export function PaymentDisplay({ payment, onNewPayment }: PaymentDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [qrisLoading, setQrisLoading] = useState(true);
  const [qrisError, setQrisError] = useState(false);
  const [qrisDataUrl, setQrisDataUrl] = useState<string>('');

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

  useEffect(() => {
    const generateQris = async () => {
      try {
        setQrisLoading(true);
        setQrisError(false);

        const response = await fetch(
          `${supabaseUrl}/functions/v1/generate-qris?amount=${payment.total_pembayaran}`
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setQrisDataUrl(url);
        setQrisLoading(false);
      } catch (err) {
        console.error('Error generating QRIS:', err);
        setQrisError(true);
        setQrisLoading(false);
      }
    };

    generateQris();

    return () => {
      if (qrisDataUrl) {
        URL.revokeObjectURL(qrisDataUrl);
      }
    };
  }, [payment.total_pembayaran, supabaseUrl]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(payment.total_pembayaran.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md w-full">
      <div className="flex items-center justify-center gap-2 mb-6">
        <CheckCircle className="w-8 h-8 text-green-600" />
        <h2 className="text-2xl font-bold text-gray-800">Pembayaran Dibuat</h2>
      </div>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-600">Nama Warga</p>
            <p className="text-lg font-semibold text-gray-800">{payment.nama_warga}</p>
          </div>

          <div className="border-t pt-3">
            <p className="text-sm text-gray-600">Nominal Dasar</p>
            <p className="text-lg font-semibold text-gray-800">
              {formatRupiah(payment.nominal_dasar)}
            </p>
          </div>

          <div className="border-t pt-3">
            <p className="text-sm text-gray-600">Kode Unik</p>
            <p className="text-lg font-semibold text-blue-600">+ {payment.kode_unik}</p>
          </div>

          <div className="border-t pt-3 bg-blue-50 -mx-4 -mb-4 px-4 py-3 rounded-b-lg">
            <p className="text-sm text-gray-600 mb-1">Total Pembayaran</p>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold text-blue-600">
                {formatRupiah(payment.total_pembayaran)}
              </p>
              <button
                onClick={handleCopy}
                className="p-2 hover:bg-blue-100 rounded-lg transition"
                title="Copy nominal"
              >
                {copied ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <Copy className="w-5 h-5 text-blue-600" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-sm font-medium text-gray-700 mb-3 text-center">
          Scan QRIS di bawah ini
        </p>
        <div className="bg-gray-100 p-4 rounded-lg flex items-center justify-center min-h-96">
          {qrisError ? (
            <div className="flex flex-col items-center gap-2 text-red-600">
              <AlertCircle className="w-8 h-8" />
              <p className="text-sm">Gagal memuat QRIS</p>
            </div>
          ) : qrisLoading ? (
            <div className="flex flex-col items-center gap-2 text-gray-500">
              <div className="animate-spin h-8 w-8 border-4 border-gray-300 border-t-blue-600 rounded-full"></div>
              <p className="text-sm">Generating QRIS...</p>
            </div>
          ) : qrisDataUrl ? (
            <img
              src={qrisDataUrl}
              alt="QRIS Payment"
              className="w-64 h-64 rounded-lg"
            />
          ) : null}
        </div>
        <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-sm text-green-800 text-center">
            <strong>Nominal otomatis:</strong>{' '}
            <span className="font-bold">{formatRupiah(payment.total_pembayaran)}</span>
          </p>
        </div>
      </div>

      <button
        onClick={onNewPayment}
        className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition"
      >
        Buat Pembayaran Baru
      </button>
    </div>
  );
}
