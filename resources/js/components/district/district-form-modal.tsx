import React from "react";
import { useForm } from "@inertiajs/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Ugel {
    id: number;
    name: string;
    code: string;
    region: {
        id: number;
        name: string;
    };
}

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

interface DistrictFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  district?: District | null;
  ugels: Ugel[];
}

export default function DistrictFormModal({
  isOpen,
  onClose,
  district,
  ugels,
}: DistrictFormModalProps) {
  const { data, setData, post, put, processing, errors, reset } = useForm({
    ugel_id: district?.ugel_id?.toString() || "",
    name: district?.name || "",
    code: district?.code || "",
    status: district?.status || "active",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const onSuccess = () => {
      reset();
      onClose();
    };

    if (district) {
      put(`/districts/${district.id}`, {
        onSuccess,
      });
    } else {
            post("/districts", {
        onSuccess,
      });
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {district ? "Editar Distrito" : "Crear Nuevo Distrito"}
          </DialogTitle>
          <DialogDescription>
            {district
              ? "Modifica la información del distrito seleccionado."
              : "Completa los datos para crear un nuevo distrito en el sistema."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* UGEL */}
          <div className="space-y-2">
            <Label htmlFor="ugel_id">
              UGEL <span className="text-red-500">*</span>
            </Label>
            <Select
              value={data.ugel_id}
              onValueChange={(value) => setData("ugel_id", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar UGEL" />
              </SelectTrigger>
              <SelectContent>
                {ugels.map((ugel) => (
                  <SelectItem key={ugel.id} value={ugel.id.toString()}>
                    {ugel.name} - {ugel.region.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.ugel_id && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.ugel_id}</p>
            )}
          </div>

          {/* Nombre */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Nombre <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              value={data.name}
              onChange={(e) => setData("name", e.target.value)}
              placeholder="Nombre del distrito"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.name}</p>
            )}
          </div>

          {/* Código */}
          <div className="space-y-2">
            <Label htmlFor="code">
              Código <span className="text-red-500">*</span>
            </Label>
            <Input
              id="code"
              type="text"
              value={data.code}
              onChange={(e) => setData("code", e.target.value.toUpperCase())}
              placeholder="Código del distrito"
              className={errors.code ? 'border-red-500' : ''}
              style={{ textTransform: "uppercase" }}
            />
            {errors.code && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.code}</p>
            )}
          </div>

          {/* Estado */}
          <div className="space-y-2">
            <Label htmlFor="status">
              Estado <span className="text-red-500">*</span>
            </Label>
            <Select
              value={data.status}
              onValueChange={(value) => setData("status", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Activo</SelectItem>
                <SelectItem value="inactive">Inactivo</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.status}</p>
            )}
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={processing}
              className="cursor-pointer"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={processing}
              className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 cursor-pointer"
            >
              {processing ? 'Guardando...' : district ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
