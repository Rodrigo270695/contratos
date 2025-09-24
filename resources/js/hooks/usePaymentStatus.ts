import { useState, useEffect, useCallback } from 'react';

export interface PaymentConfig {
  contractDate: string;
  graceDays?: number;
  clientName?: string;
  projectName?: string;
  checkInterval?: number; // en milisegundos
}

export interface PaymentStatus {
  isOverdue: boolean;
  isInGracePeriod: boolean;
  daysLate: number;
  hoursLate: number;
  fadeLevel: number;
  status: 'active' | 'grace' | 'warning' | 'critical' | 'blocked';
  timeUntilDue: number; // milisegundos hasta vencimiento
  message: string;
}

/**
 * Hook personalizado para gestionar el estado de pagos contractuales
 * Implementa degradación progresiva de la interfaz basada en fechas de pago
 */
export const usePaymentStatus = (config: PaymentConfig): PaymentStatus => {
  const {
    contractDate,
    graceDays = 3,
    clientName = 'Cliente',
    projectName = 'Proyecto',
    checkInterval = 60000 // 1 minuto por defecto
  } = config;

  const [status, setStatus] = useState<PaymentStatus>({
    isOverdue: false,
    isInGracePeriod: false,
    daysLate: 0,
    hoursLate: 0,
    fadeLevel: 1,
    status: 'active',
    timeUntilDue: 0,
    message: ''
  });

  const calculatePaymentStatus = useCallback((): PaymentStatus => {
    const now = new Date();
    const dueDate = new Date(contractDate);
    const graceEndDate = new Date(dueDate.getTime() + (graceDays * 24 * 60 * 60 * 1000));

    const timeDiff = now.getTime() - dueDate.getTime();
    const timeUntilDue = dueDate.getTime() - now.getTime();
    const daysLate = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hoursLate = Math.floor(timeDiff / (1000 * 60 * 60));

    // Si aún no vence - NO mostrar ninguna advertencia ni efecto
    if (now < dueDate) {
      return {
        isOverdue: false,
        isInGracePeriod: false,
        daysLate: 0,
        hoursLate: 0,
        fadeLevel: 1,
        status: 'active',
        timeUntilDue,
        message: `✅ Proyecto activo`
      };
    }

    // Si está en período de gracia
    if (now >= dueDate && now <= graceEndDate) {
      const fadeLevel = Math.max(0.6, 1 - (daysLate * 0.1));
      return {
        isOverdue: true,
        isInGracePeriod: true,
        daysLate,
        hoursLate,
        fadeLevel,
        status: 'grace',
        timeUntilDue,
        message: `⏰ Período de gracia: ${daysLate} día${daysLate > 1 ? 's' : ''} de retraso`
      };
    }

    // Después del período de gracia - degradación progresiva
    const totalOverdueDays = daysLate - graceDays;

    if (totalOverdueDays <= 2) {
      // Warning: 2 primeros días después de gracia
      return {
        isOverdue: true,
        isInGracePeriod: false,
        daysLate,
        hoursLate,
        fadeLevel: 0.4,
        status: 'warning',
        timeUntilDue,
        message: `🚨 Pago vencido: ${daysLate} días de retraso`
      };
    } else if (totalOverdueDays <= 5) {
      // Critical: días 3-5 después de gracia
      return {
        isOverdue: true,
        isInGracePeriod: false,
        daysLate,
        hoursLate,
        fadeLevel: 0.2,
        status: 'critical',
        timeUntilDue,
        message: `⛔ Estado crítico: ${daysLate} días de retraso`
      };
    } else {
      // Blocked: más de 5 días después de gracia
      return {
        isOverdue: true,
        isInGracePeriod: false,
        daysLate,
        hoursLate,
        fadeLevel: 0.05,
        status: 'blocked',
        timeUntilDue,
        message: `🔒 Acceso bloqueado: ${daysLate} días de retraso`
      };
    }
  }, [contractDate, graceDays]);

  useEffect(() => {
    // Cálculo inicial
    setStatus(calculatePaymentStatus());

    // Configurar intervalo de verificación
    const interval = setInterval(() => {
      setStatus(calculatePaymentStatus());
    }, checkInterval);

    return () => clearInterval(interval);
  }, [calculatePaymentStatus, checkInterval]);

  return status;
};

/**
 * Hook simplificado para casos básicos
 */
export const useSimplePaymentCheck = (
  dueDate: string,
  graceDays: number = 3
): { isBlocked: boolean; daysLate: number; fadeLevel: number } => {
  const status = usePaymentStatus({
    contractDate: dueDate,
    graceDays
  });

  return {
    isBlocked: status.status === 'blocked',
    daysLate: status.daysLate,
    fadeLevel: status.fadeLevel
  };
};
