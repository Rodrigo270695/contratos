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

interface District {
    id: number;
    name: string;
    code: string;
    ugel: {
        id: number;
        name: string;
        region: {
            id: number;
            name: string;
        };
    };
}

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

interface InstitutionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  institution?: Institution | null;
  districts: District[];
}

export default function InstitutionFormModal({
  isOpen,
  onClose,
  institution,
  districts,
}: InstitutionFormModalProps) {
  const { data, setData, post, put, processing, errors, reset } = useForm({
    district_id: institution?.district_id?.toString() || "",
    name: institution?.name || "",
    code: institution?.code || "",
    level: institution?.level || "primaria",
    modality: institution?.modality || "EBR",
    address: institution?.address || "",
    status: institution?.status || "active",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const onSuccess = () => {
      reset();
      onClose();
    };

    if (institution) {
      put(`/institutions/${institution.id}`, {
        onSuccess,
      });
    } else {
      post("/institutions", {
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {institution ? "Editar Institución" : "Crear Nueva Institución"}
          </DialogTitle>
          <DialogDescription>
            {institution
              ? "Modifica la información de la institución educativa seleccionada."
              : "Completa los datos para crear una nueva institución educativa en el sistema."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Distrito */}
          <div className="space-y-2">
            <Label htmlFor="district_id">
              Distrito <span className="text-red-500">*</span>
            </Label>
            <Select
              value={data.district_id}
              onValueChange={(value) => setData("district_id", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar distrito" />
              </SelectTrigger>
              <SelectContent>
                {districts.map((district) => (
                  <SelectItem key={district.id} value={district.id.toString()}>
                    {district.name} - {district.ugel.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.district_id && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.district_id}</p>
            )}
          </div>

          {/* Nombre */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Nombre de la Institución <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              value={data.name}
              onChange={(e) => setData("name", e.target.value)}
              placeholder="Nombre de la institución educativa"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.name}</p>
            )}
          </div>

          {/* Código */}
          <div className="space-y-2">
            <Label htmlFor="code">
              Código Modular <span className="text-red-500">*</span>
            </Label>
            <Input
              id="code"
              type="text"
              value={data.code}
              onChange={(e) => setData("code", e.target.value.toUpperCase())}
              placeholder="Código modular de la institución"
              className={errors.code ? 'border-red-500' : ''}
              style={{ textTransform: "uppercase" }}
            />
            {errors.code && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.code}</p>
            )}
          </div>

          {/* Nivel y Modalidad en una fila */}
          <div className="grid grid-cols-2 gap-4">
            {/* Nivel */}
            <div className="space-y-2">
              <Label htmlFor="level">
                Nivel Educativo <span className="text-red-500">*</span>
              </Label>
              <Select
                value={data.level}
                onValueChange={(value) => setData("level", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inicial">Inicial</SelectItem>
                  <SelectItem value="primaria">Primaria</SelectItem>
                  <SelectItem value="secundaria">Secundaria</SelectItem>
                </SelectContent>
              </Select>
              {errors.level && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.level}</p>
              )}
            </div>

            {/* Modalidad */}
            <div className="space-y-2">
              <Label htmlFor="modality">
                Modalidad <span className="text-red-500">*</span>
              </Label>
              <Select
                value={data.modality}
                onValueChange={(value) => setData("modality", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EBR">EBR</SelectItem>
                  <SelectItem value="EBA">EBA</SelectItem>
                  <SelectItem value="EBE">EBE</SelectItem>
                </SelectContent>
              </Select>
              {errors.modality && (
                <p className="text-sm text-red-600 dark:text-red-400">{errors.modality}</p>
              )}
            </div>
          </div>

          {/* Dirección */}
          <div className="space-y-2">
            <Label htmlFor="address">
              Dirección
            </Label>
            <Input
              id="address"
              type="text"
              value={data.address}
              onChange={(e) => setData("address", e.target.value)}
              placeholder="Dirección de la institución educativa"
              className={errors.address ? 'border-red-500' : ''}
            />
            {errors.address && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.address}</p>
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
              {processing ? 'Guardando...' : institution ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
