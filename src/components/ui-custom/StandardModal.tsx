
import React from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { CheckCircle, AlertTriangle, XCircle, Info } from "lucide-react";

export type ModalType = "success" | "error" | "warning" | "info" | "confirmation";

interface StandardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  type: ModalType;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
}

export function StandardModal({
  isOpen,
  onClose,
  onConfirm,
  type,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  showCancel = false
}: StandardModalProps) {
  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-6 w-6 text-econotrip-green" />;
      case "error":
        return <XCircle className="h-6 w-6 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
      case "confirmation":
        return <AlertTriangle className="h-6 w-6 text-econotrip-orange" />;
      default:
        return <Info className="h-6 w-6 text-econotrip-blue" />;
    }
  };

  const getButtonStyle = () => {
    switch (type) {
      case "success":
        return "bg-econotrip-green hover:bg-econotrip-green/90";
      case "error":
        return "bg-red-500 hover:bg-red-600";
      case "warning":
        return "bg-yellow-500 hover:bg-yellow-600";
      default:
        return "bg-econotrip-blue hover:bg-econotrip-blue/90";
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md rounded-2xl p-6">
        <AlertDialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            {getIcon()}
          </div>
          <AlertDialogTitle className="text-xl font-museomoderno font-bold text-econotrip-blue mb-2">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-lg text-gray-700 leading-relaxed">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col gap-3 mt-6">
          <AlertDialogAction
            onClick={onConfirm || onClose}
            className={`w-full text-white font-medium py-3 px-6 rounded-xl text-lg ${getButtonStyle()}`}
          >
            {confirmText}
          </AlertDialogAction>
          {showCancel && (
            <AlertDialogCancel
              onClick={onClose}
              className="w-full bg-gray-200 text-gray-700 hover:bg-gray-300 font-medium py-3 px-6 rounded-xl text-lg border-0"
            >
              {cancelText}
            </AlertDialogCancel>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
