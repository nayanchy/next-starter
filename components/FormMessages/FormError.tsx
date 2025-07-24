import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";

const FormError = ({ message }: { message: string }) => {
  if (!message) return null;

  return (
    <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive">
      <FaExclamationTriangle className="h-5 w-5" />
      <span>{message}</span>
    </div>
  );
};

export default FormError;
