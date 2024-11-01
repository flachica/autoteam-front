import { useState } from "react";

const useConfirmationDialog = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedOperation, setSelectedOperation] = useState("");

    const openDialog = (operation: string) => {
        setSelectedOperation(operation);
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
    };

    return {
        isDialogOpen,
        selectedOperation,
        openDialog,
        closeDialog,
    };
};

export default useConfirmationDialog;
