import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode, useState } from 'react';
import { usePaymentStatus } from '@/hooks/usePaymentStatus';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PaymentGuardProps {
  children: ReactNode;
  contractDate: string;
  graceDays: number;
  clientName: string;
  projectName: string;
  checkInterval?: number;
  onPaymentRequest?: () => void;
  onContactSupport?: () => void;
  showDebugInfo?: boolean;
  disableEffects?: boolean;
}

/**
 * Componente principal que protege la aplicación con efectos de degradación
 * basados en el estado de pagos contractuales
 */
export const PaymentGuard = ({
  children,
  contractDate,
  graceDays = 3,
  clientName = 'Cliente',
  projectName = 'Sistema de Convocatorias UGEL',
  checkInterval = 60000,
  onPaymentRequest,
  onContactSupport,
  showDebugInfo = false,
  disableEffects = false
}: PaymentGuardProps) => {
  const [showDetails, setShowDetails] = useState(false);

  const paymentStatus = usePaymentStatus({
    contractDate,
    graceDays,
    clientName,
    projectName,
    checkInterval
  });

  const {
    isOverdue,
    isInGracePeriod,
    daysLate,
    hoursLate,
    fadeLevel,
    status,
    message
  } = paymentStatus;

  // Si los efectos están deshabilitados, mostrar solo el contenido
  if (disableEffects) {
    return <>{children}</>;
  }

  // Configuración de efectos basada en el estado
  // SOLO aplicar efectos si ya está vencido (no antes)
  const getEffectsConfig = () => {
    // Si no está vencido, NO aplicar ningún efecto
    if (!isOverdue) {
      return {
        opacity: 1,
        blur: 0,
        grayscale: 0,
        scale: 1,
        pointerEvents: 'auto' as const,
        userSelect: 'auto' as const
      };
    }

    switch (status) {
      case 'active':
        return {
          opacity: 1,
          blur: 0,
          grayscale: 0,
          scale: 1,
          pointerEvents: 'auto' as const,
          userSelect: 'auto' as const
        };
      case 'grace':
        return {
          opacity: fadeLevel,
          blur: 1,
          grayscale: 20,
          scale: 1,
          pointerEvents: 'auto' as const,
          userSelect: 'auto' as const
        };
      case 'warning':
        return {
          opacity: fadeLevel,
          blur: 3,
          grayscale: 40,
          scale: 0.98,
          pointerEvents: 'auto' as const,
          userSelect: 'auto' as const
        };
      case 'critical':
        return {
          opacity: fadeLevel,
          blur: 6,
          grayscale: 70,
          scale: 0.95,
          pointerEvents: 'auto' as const,
          userSelect: 'text' as const
        };
      case 'blocked':
        return {
          opacity: fadeLevel,
          blur: 10,
          grayscale: 90,
          scale: 0.9,
          pointerEvents: 'none' as const,
          userSelect: 'none' as const
        };
      default:
        return {
          opacity: 1,
          blur: 0,
          grayscale: 0,
          scale: 1,
          pointerEvents: 'auto' as const,
          userSelect: 'auto' as const
        };
    }
  };

  const effects = getEffectsConfig();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'grace': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'warning': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'blocked': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return '✅';
      case 'grace': return '⏰';
      case 'warning': return '🚨';
      case 'critical': return '⛔';
      case 'blocked': return '🔒';
      default: return '❓';
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Contenido principal con efectos */}
      <motion.div
        animate={{
          opacity: effects.opacity,
          filter: `blur(${effects.blur}px) grayscale(${effects.grayscale}%)`,
          scale: effects.scale
        }}
        transition={{
          duration: 2,
          ease: 'easeInOut'
        }}
        style={{
          pointerEvents: effects.pointerEvents,
          userSelect: effects.userSelect
        }}
        className="relative z-10"
      >
        {children}
      </motion.div>

      {/* Notificación de estado flotante - SOLO después del vencimiento */}
      <AnimatePresence>
        {(isOverdue && status !== 'active') && (
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            className="fixed top-4 right-4 z-50 max-w-sm"
          >
            <Card className={`p-4 border-2 ${getStatusColor(status)} shadow-lg`}>
              <div className="flex items-start gap-3">
                <span className="text-2xl">{getStatusIcon(status)}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {status.toUpperCase()}
                    </Badge>
                    <button
                      onClick={() => setShowDetails(!showDetails)}
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      {showDetails ? 'Ocultar' : 'Detalles'}
                    </button>
                  </div>

                  <p className="text-sm font-medium mb-1">{message}</p>

                  {showDetails && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="text-xs text-gray-600 space-y-1 mt-2 pt-2 border-t"
                    >
                      <div>Cliente: <strong>{clientName}</strong></div>
                      <div>Proyecto: <strong>{projectName}</strong></div>
                      <div>Vencimiento: <strong>{new Date(contractDate).toLocaleDateString('es-ES')}</strong></div>
                      {isOverdue && (
                        <>
                          <div>Días de retraso: <strong>{daysLate}</strong></div>
                          <div>Horas de retraso: <strong>{hoursLate}</strong></div>
                          <div>Nivel de fade: <strong>{Math.round(fadeLevel * 100)}%</strong></div>
                        </>
                      )}
                    </motion.div>
                  )}

                  <div className="flex gap-2 mt-3">
                    {onPaymentRequest && (
                      <Button
                        size="sm"
                        onClick={onPaymentRequest}
                        className="text-xs"
                      >
                        💳 Realizar Pago
                      </Button>
                    )}
                    {onContactSupport && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={onContactSupport}
                        className="text-xs"
                      >
                        📞 Contactar
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de bloqueo crítico */}
      <AnimatePresence>
        {status === 'blocked' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="bg-white rounded-xl p-8 max-w-md w-full text-center shadow-2xl"
            >
              <div className="text-6xl mb-4">🔒</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Acceso Restringido
              </h2>
              <p className="text-gray-600 mb-4">
                El acceso al sistema ha sido limitado debido a pagos pendientes.
              </p>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="text-sm text-red-800">
                  <div><strong>Cliente:</strong> {clientName}</div>
                  <div><strong>Proyecto:</strong> {projectName}</div>
                  <div><strong>Días de retraso:</strong> {daysLate}</div>
                  <div><strong>Vencimiento:</strong> {new Date(contractDate).toLocaleDateString('es-ES')}</div>
                </div>
              </div>

              <div className="space-y-3">
                {onPaymentRequest && (
                  <Button
                    onClick={onPaymentRequest}
                    className="w-full"
                    size="lg"
                  >
                    💳 Procesar Pago Pendiente
                  </Button>
                )}
                {onContactSupport && (
                  <Button
                    onClick={onContactSupport}
                    variant="outline"
                    className="w-full"
                    size="lg"
                  >
                    📞 Contactar Soporte
                  </Button>
                )}
              </div>

              <p className="text-xs text-gray-500 mt-4">
                El acceso se restaurará automáticamente una vez confirmado el pago.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Debug info (solo en desarrollo) */}
      {showDebugInfo && (
        <div className="fixed bottom-4 left-4 bg-black/80 text-white text-xs p-3 rounded font-mono z-50">
          <div>Status: {status}</div>
          <div>Fade: {Math.round(fadeLevel * 100)}%</div>
          <div>Overdue: {isOverdue ? 'Yes' : 'No'}</div>
          <div>Grace: {isInGracePeriod ? 'Yes' : 'No'}</div>
          <div>Days Late: {daysLate}</div>
          <div>Contract: {new Date(contractDate).toLocaleDateString()}</div>
        </div>
      )}
    </div>
  );
};

export default PaymentGuard;
