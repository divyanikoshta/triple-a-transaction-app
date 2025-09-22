import React from 'react';
import { CheckCircle, X } from 'lucide-react';
import Button from './ui/Button';

interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    message: string;
    details?: {
        sourceAccount?: string;
        destinationAccount?: string;
        amount?: string;
    };
}

const SuccessModal: React.FC<SuccessModalProps> = ({
    isOpen,
    onClose,
    title = "Transfer Successful",
    message,
    details
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle size={24} className="text-green-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                    </div>
                    <button
                        aria-label="close"
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 rounded-full transition-colors p-2"
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="p-6">
                    <p className="text-gray-700 mb-6">{message}</p>

                    {details && (
                        <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-medium text-gray-900 mb-3">Transaction Details</h3>

                            {details.sourceAccount && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">From Account:</span>
                                    <span className="font-medium">#{details.sourceAccount}</span>
                                </div>
                            )}

                            {details.destinationAccount && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">To Account:</span>
                                    <span className="font-medium">#{details.destinationAccount}</span>
                                </div>
                            )}

                            {details.amount && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Amount:</span>
                                    <span className="font-medium text-green-600">${parseFloat(details.amount).toLocaleString()}</span>
                                </div>
                            )}


                            <div className="flex justify-between border-t border-gray-200 pt-3 mt-3">
                                <span className="text-gray-600">Date:</span>
                                <span className="font-medium">{new Date().toLocaleString()}</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
                    <Button onClick={onClose}>
                        Continue
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SuccessModal;