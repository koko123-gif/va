import { useState } from 'react';
import { PaymentForm, PaymentData } from './components/PaymentForm';
import { PaymentDisplay } from './components/PaymentDisplay';

function App() {
  const [currentPayment, setCurrentPayment] = useState<PaymentData | null>(null);

  const handlePaymentCreated = (payment: PaymentData) => {
    setCurrentPayment(payment);
  };

  const handleNewPayment = () => {
    setCurrentPayment(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {!currentPayment ? (
          <PaymentForm onPaymentCreated={handlePaymentCreated} />
        ) : (
          <PaymentDisplay payment={currentPayment} onNewPayment={handleNewPayment} />
        )}
      </div>
    </div>
  );
}

export default App;
