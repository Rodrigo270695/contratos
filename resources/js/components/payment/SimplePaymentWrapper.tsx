import { ReactNode } from 'react';
import SimplePaymentGuard from './SimplePaymentGuard';

interface SimplePaymentWrapperProps {
  children: ReactNode;
  disabled?: boolean;
  testVencido?: boolean; // Para pruebas rápidas
}

export const SimplePaymentWrapper = ({
  children,
  disabled = false,
  testVencido = false
}: SimplePaymentWrapperProps) => {

  // Configuración simple - solo cambiar la fecha aquí
  const config = {
    clientName: 'UGEL Chiclayo',
    projectName: 'Sistema de Convocatorias Docentes',
    dueDate: testVencido
      ? new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 día atrás para prueba
      : '2025-09-30T23:59:59', // 30 de septiembre 2025
    graceDays: 3,
    amount: 5000,
    currency: 'PEN',
    contactPhone: '+51976709811'
  };

  if (disabled) {
    return <>{children}</>;
  }

  return (
    <SimplePaymentGuard
      dueDate={config.dueDate}
      graceDays={config.graceDays}
      clientName={config.clientName}
      projectName={config.projectName}
      amount={config.amount}
      currency={config.currency}
      contactPhone={config.contactPhone}
      disabled={disabled}
    >
      {children}
    </SimplePaymentGuard>
  );
};

export default SimplePaymentWrapper;
