import { motion } from 'framer-motion';
import { ReactNode, useState, useEffect } from 'react';

interface SimplePaymentGuardProps {
  children: ReactNode;
  dueDate: string;
  graceDays: number;
  clientName: string;
  projectName: string;
  amount: number;
  currency: string;
  contactPhone: string;
  disabled?: boolean;
}

export const SimplePaymentGuard = ({
  children,
  dueDate,
  graceDays = 3,
  clientName,
  projectName,
  amount,
  currency,
  contactPhone,
  disabled = false
}: SimplePaymentGuardProps) => {
  const [isOverdue, setIsOverdue] = useState(false);
  const [daysLate, setDaysLate] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const checkPaymentStatus = () => {
      const now = new Date();
      const due = new Date(dueDate);
      const graceEnd = new Date(due.getTime() + (graceDays * 24 * 60 * 60 * 1000));

      if (now > due) {
        const daysDiff = Math.floor((now.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
        setDaysLate(daysDiff);
        setIsOverdue(true);

        // Mostrar modal solo si está en período de gracia
        if (now <= graceEnd) {
          setShowModal(true);
        } else if (daysDiff > graceDays) {
          // Bloquear completamente después del período de gracia
          setShowModal(true);
        }
      } else {
        setIsOverdue(false);
        setShowModal(false);
        setDaysLate(0);
      }
    };

    if (!disabled) {
      checkPaymentStatus();
      const interval = setInterval(checkPaymentStatus, 60000); // Cada minuto
      return () => clearInterval(interval);
    }
  }, [dueDate, graceDays, disabled]);

  const handlePayment = () => {
    const message = encodeURIComponent(
      `Hola, necesito procesar el pago del proyecto "${projectName}". Cliente: ${clientName}. Monto: ${amount} ${currency}`
    );
    window.open(`https://wa.me/${contactPhone.replace(/[^\d]/g, '')}?text=${message}`);
  };

  const getOpacity = () => {
    if (!isOverdue || disabled) return 1;
    if (daysLate <= graceDays) return Math.max(0.6, 1 - (daysLate * 0.1));
    return 0.1;
  };

  const getBlur = () => {
    if (!isOverdue || disabled) return 0;
    if (daysLate <= graceDays) return Math.min(3, daysLate);
    return 8;
  };

  if (disabled) {
    return <>{children}</>;
  }

  return (
    <div className="relative min-h-screen">
      {/* Contenido principal con efectos */}
      <motion.div
        animate={{
          opacity: getOpacity(),
          filter: `blur(${getBlur()}px)`,
          scale: isOverdue ? 0.95 : 1
        }}
        transition={{ duration: 2 }}
        style={{
          pointerEvents: daysLate > graceDays ? 'none' : 'auto'
        }}
      >
        {children}
      </motion.div>

      {/* Notificación flotante */}
      {isOverdue && daysLate <= graceDays && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-4 right-4 z-50 max-w-sm"
        >
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">⏰</span>
              <strong>Pago Vencido</strong>
            </div>
            <p className="text-sm mb-2">
              Proyecto: {projectName}<br />
              Cliente: {clientName}<br />
              Días de retraso: {daysLate}
            </p>
            <button
              onClick={handlePayment}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm"
            >
              💳 Procesar Pago
            </button>
          </div>
        </motion.div>
      )}

      {/* Modal de bloqueo */}
      {showModal && daysLate > graceDays && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-xl p-8 max-w-md w-full text-center"
          >
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Acceso Restringido
            </h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="text-sm text-red-800">
                <div><strong>Cliente:</strong> {clientName}</div>
                <div><strong>Proyecto:</strong> {projectName}</div>
                <div><strong>Días de retraso:</strong> {daysLate}</div>
                <div><strong>Monto:</strong> {amount} {currency}</div>
              </div>
            </div>
            <button
              onClick={handlePayment}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium"
            >
              💳 Procesar Pago Ahora
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* Debug info - SOLO cuando está vencido */}
      {isOverdue && (
        <div className="fixed bottom-4 left-4 bg-black/80 text-white text-xs p-3 rounded font-mono z-50">
          <div>Vencido: Sí</div>
          <div>Días tarde: {daysLate}</div>
          <div>Mostrar modal: {showModal ? 'Sí' : 'No'}</div>
          <div>Vencimiento: {new Date(dueDate).toLocaleDateString()}</div>
          <div>Opacidad: {Math.round(getOpacity() * 100)}%</div>
        </div>
      )}
    </div>
  );
};

export default SimplePaymentGuard;
