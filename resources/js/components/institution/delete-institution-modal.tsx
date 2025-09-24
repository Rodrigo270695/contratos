import React from "react";
import { useForm } from "@inertiajs/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface Institution {
    id: number;
    name: string;
    code: string;
    level: 'inicial' | 'primaria' | 'secundaria';
    modality: 'EBR' | 'EBA' | 'EBE';
    address?: string;
    status: 'active' | 'inactive';
    district_id: number;
    district: {
        id: number;
        name: string;
        code: string;
        ugel: {
            id: number;
            name: string;
            code: string;
            region: {
                id: number;
                name: string;
            };
        };
    };
    created_at: string;
    updated_at: string;
}

interface DeleteInstitutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  institution: Institution | null;
}

export default function DeleteInstitutionModal({
  isOpen,
  onClose,
  institution,
}: DeleteInstitutionModalProps) {
  const { delete: destroy, processing } = useForm();

  const handleDelete = () => {
    if (!institution) return;

    destroy(`/institutions/${institution.id}`, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  if (!institution) return null;

  const levelLabels = {
    inicial: 'Inicial',
    primaria: 'Primaria',
    secundaria: 'Secundaria'
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <DialogTitle className="text-lg font-medium text-gray-900">
                Eliminar Institución
              </DialogTitle>
            </div>
          </div>
          <DialogDescription className="mt-2 text-sm text-gray-500">
            ¿Estás seguro de que deseas eliminar la institución{" "}
            <span className="font-medium text-gray-900">"{institution.name}"</span>?
            Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600">
            <div className="mb-2">
              <span className="font-medium">Institución:</span> {institution.name}
            </div>
            <div className="mb-2">
              <span className="font-medium">Código:</span> {institution.code}
            </div>
            <div className="mb-2">
              <span className="font-medium">Nivel:</span> {levelLabels[institution.level]} ({institution.modality})
            </div>
            <div className="mb-2">
              <span className="font-medium">Distrito:</span> {institution.district.name}
            </div>
            <div className="mb-2">
              <span className="font-medium">UGEL:</span> {institution.district.ugel.name}
            </div>
            <div>
              <span className="font-medium">Región:</span> {institution.district.ugel.region.name}
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={processing}
            className="cursor-pointer"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={processing}
            className="cursor-pointer"
          >
            {processing ? "Eliminando..." : "Eliminar Institución"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
