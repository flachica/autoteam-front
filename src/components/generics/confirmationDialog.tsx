import React, { useEffect } from "react";

export enum OperationName {
    COURT_IN = 'court-in',
    COURT_OUT = 'court-out',
    COURT_RESERVE = 'court-reserve',
    COURT_DELETE = 'court-delete',
    COURT_UNRESERVE = 'court-unreserve',
    MOVEMENT_VALIDATE = 'movement-validate',
    MOVEMENT_REMOVE = 'movement-remove',
  }

export interface Operation {
    message: string;
    name: OperationName;
    data: any;
}

interface ConfirmationDialogProps {
    isOpen: boolean;
    operation?: Operation;
    message?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
    isOpen,
    operation,
    message,
    onConfirm,
    onCancel,
}) => {
    if (!isOpen) return null;
    if (!operation) return null;
    return (
<div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
    <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-lg font-bold mb-4 text-black">
            Confirmar operación de {operation.message}
        </h2>
        <p className="text-black">
            ¿Estás seguro de que deseas {operation.message}?
        </p>
        {message && <p className="text-red-500">{message}</p>}
        <div className="mt-4 flex justify-end">
            <button
                className="bg-gray-500 text-white py-2 px-4 rounded mr-2"
                onClick={onCancel}
            >
                Cancelar
            </button>
            <button
                className="bg-blue-500 text-white py-2 px-4 rounded"
                onClick={onConfirm}
            >
                {operation.message}
            </button>
        </div>
    </div>
</div>);
};

export default ConfirmationDialog;
