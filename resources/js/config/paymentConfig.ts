/**
 * CONFIGURACIÓN SIMPLE DE PROTECCIÓN DE PAGOS
 *
 * ⚠️ SOLO CAMBIA LA FECHA DE VENCIMIENTO AQUÍ ⚠️
 */

export interface ClientPaymentConfig {
  clientName: string;
  projectName: string;
  contractDate: string;
  graceDays: number;
  contactEmail?: string;
  contactPhone?: string;
  paymentMethod?: string;
  amount?: number;
  currency?: string;
}

/**
 * CONFIGURACIÓN PRINCIPAL - CAMBIA SOLO ESTA FECHA
 */
export const PAYMENT_CONFIG: ClientPaymentConfig = {
  clientName: 'UGEL Chiclayo',
  projectName: 'Sistema de Convocatorias Docentes',
  contractDate: '2025-09-12T23:59:59', // ← CAMBIA ESTA FECHA POR LA TUYA
  graceDays: 1, // Días de gracia para cobrar después del vencimiento
  contactEmail: 'admin@ugel-chiclayo.gob.pe',
  contactPhone: '+51 976709811',
  paymentMethod: 'Transferencia bancaria',
  amount: 5000,
  currency: 'PEN'
};

/**
 * Configuración para pruebas (opcional)
 */
export const TEST_CONFIGS = {
  // Para probar que NO aparece nada antes del vencimiento
  active: {
    ...PAYMENT_CONFIG,
    clientName: 'Prueba Activo',
    contractDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 días futuro
  },

  // Para probar que SÍ aparece modal después del vencimiento
  overdue: {
    ...PAYMENT_CONFIG,
    clientName: 'Prueba Vencido',
    contractDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 día atrás
  }
};

/**
 * Configuración global del sistema
 */
export const SYSTEM_CONFIG = {
  checkInterval: 60 * 1000, // Verificar cada minuto
  enableEffects: true,
  showDebugInfo: true, // ACTIVADO para ver qué pasa
};

/**
 * Función principal para obtener la configuración
 */
export const getPaymentConfig = (testMode?: 'active' | 'overdue'): ClientPaymentConfig => {
  if (testMode) {
    return TEST_CONFIGS[testMode];
  }
  return PAYMENT_CONFIG;
};

/**
 * Función para obtener fecha formateada
 */
export const getFormattedDueDate = (testMode?: 'active' | 'overdue'): string => {
  const config = getPaymentConfig(testMode);
  return new Date(config.contractDate).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Función para calcular días hasta vencimiento
 */
export const getDaysUntilDue = (testMode?: 'active' | 'overdue'): number => {
  const config = getPaymentConfig(testMode);
  const now = new Date();
  const dueDate = new Date(config.contractDate);
  const timeDiff = dueDate.getTime() - now.getTime();
  return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
};
