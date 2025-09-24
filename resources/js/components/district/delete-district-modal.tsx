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

interface District {
    id: number;
    name: string;
    code: string;
    status: 'active' | 'inactive';
    ugel_id: number;
    ugel: {
        id: number;
        name: string;
        code: string;
        region: {
            id: number;
            name: string;
        };
    };
    created_at: string;
    updated_at: string;
}

interface DeleteDistrictModalProps {
  isOpen: boolean;
  onClose: () => void;
  district: District | null;
}

export default function DeleteDistrictModal({
  isOpen,
  onClose,
  district,
}: DeleteDistrictModalProps) {
  const { delete: destroy, processing } = useForm();

  const handleDelete = () => {
    if (!district) return;

    destroy(`/districts/${district.id}`, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  if (!district) return null;

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
                Eliminar Distrito
              </DialogTitle>
            </div>
          </div>
          <DialogDescription className="mt-2 text-sm text-gray-500">
            ¿Estás seguro de que deseas eliminar el distrito{" "}
            <span className="font-medium text-gray-900">"{district.name}"</span>?
            Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600">
            <div className="mb-2">
              <span className="font-medium">Distrito:</span> {district.name}
            </div>
            <div className="mb-2">
              <span className="font-medium">Código:</span> {district.code}
            </div>
            <div className="mb-2">
              <span className="font-medium">UGEL:</span> {district.ugel.name}
            </div>
            <div>
              <span className="font-medium">Región:</span> {district.ugel.region.name}
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
            {processing ? "Eliminando..." : "Eliminar Distrito"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
