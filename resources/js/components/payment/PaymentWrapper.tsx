import { ReactNode } from 'react';
import PaymentGuard from './PaymentGuard';
import { getPaymentConfig, SYSTEM_CONFIG } from '@/config/paymentConfig';

interface PaymentWrapperProps {
  children: ReactNode;
  disabled?: boolean;
  testMode?: 'active' | 'overdue'; // Para pruebas
  onPaymentRequest?: () => void;
  onContactSupport?: () => void;
}

/**
 * Wrapper simplificado - Sistema de protección de pagos
 * Solo necesitas activar/desactivar con la prop 'disabled'
 */
export const PaymentWrapper = ({
  children,
  disabled = false,
  testMode,
  onPaymentRequest,
  onContactSupport
}: PaymentWrapperProps) => {
  const config = getPaymentConfig(testMode);

  const handlePaymentRequest = () => {
    if (onPaymentRequest) {
      onPaymentRequest();
    } else {
      // Acción por defecto - abrir WhatsApp
      const message = encodeURIComponent(
        `Hola, necesito procesar el pago del proyecto "${config.projectName}". Cliente: ${config.clientName}. Monto: ${config.amount} ${config.currency}`
      );

      if (config.contactPhone) {
        window.open(`https://wa.me/${config.contactPhone.replace(/[^\d]/g, '')}?text=${message}`);
      } else if (config.contactEmail) {
        const subject = encodeURIComponent(`Pago Pendiente - ${config.projectName}`);
        const body = encodeURIComponent(
          `Hola,\n\nNecesito procesar el pago pendiente:\n- Proyecto: ${config.projectName}\n- Cliente: ${config.clientName}\n- Monto: ${config.amount} ${config.currency}\n\nGracias.`
        );
        window.open(`mailto:${config.contactEmail}?subject=${subject}&body=${body}`);
      }
    }
  };

  const handleContactSupport = () => {
    if (onContactSupport) {
      onContactSupport();
    } else {
      // Acción por defecto - abrir WhatsApp
      if (config.contactPhone) {
        const message = encodeURIComponent(
          `Hola, necesito ayuda con el proyecto "${config.projectName}".`
        );
        window.open(`https://wa.me/${config.contactPhone.replace(/[^\d]/g, '')}?text=${message}`);
      }
    }
  };

  // Si está deshabilitado, mostrar solo el contenido
  if (disabled) {
    return <>{children}</>;
  }

  return (
    <PaymentGuard
      contractDate={config.contractDate}
      graceDays={config.graceDays}
      clientName={config.clientName}
      projectName={config.projectName}
      checkInterval={SYSTEM_CONFIG.checkInterval}
      onPaymentRequest={handlePaymentRequest}
      onContactSupport={handleContactSupport}
      showDebugInfo={SYSTEM_CONFIG.showDebugInfo}
      disableEffects={!SYSTEM_CONFIG.enableEffects}
    >
      {children}
    </PaymentGuard>
  );
};

export default PaymentWrapper;
