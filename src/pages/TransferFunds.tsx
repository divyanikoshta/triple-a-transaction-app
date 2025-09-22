import { useState } from "react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import SearchableDropdown from "../components/ui/SearchableDropdown";
import apiService from "../services/apiService";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { AlertCircle } from "lucide-react";
import SuccessModal from "../components/SuccessModal";
import AccountList, { type Account } from "../components/AccountList";
import { useNavigate } from "react-router-dom";
import Loader from "../components/ui/Loader";

interface TransferDetailForm {
    sourceAccountId: string;
    destinationAccountId: string;
    amount: string;
}

interface TransferResultProps {
    sourceAccount: string;
    destinationAccount: string;
    amount: string
}

const TransferFunds = () => {
    const [transferDetail, setTransferDetail] = useState<TransferDetailForm>({
        sourceAccountId: '',
        destinationAccountId: '',
        amount: ''
    });

    const [errors, setErrors] = useState({
        sourceAccountId: '',
        destinationAccountId: '',
        amount: ''
    });

    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [transferResult, setTransferResult] = useState<TransferResultProps>({
        sourceAccount: '',
        destinationAccount: '',
        amount: ''
    });
    const navigate = useNavigate();

    const { accountList } = useSelector((state: RootState) => state.account);


    const accountOptions = accountList.map(account => ({
        value: account.accountId.toString(),
        label: account.accountId.toString()
    }));

    const handleTransferDetailChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
        setTransferDetail(prev => ({ ...prev, [key]: e.target.value }))
        if (errors[key as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [key]: '' }));
        }
    }

    const isFormValid = () => {
        let hasErrors = false;
        const newErrors = { sourceAccountId: '', destinationAccountId: '', amount: '' };

        if (!transferDetail.sourceAccountId) {
            newErrors.sourceAccountId = "Source AccountId is required."
            hasErrors = true;
        }

        if (!transferDetail.destinationAccountId) {
            newErrors.destinationAccountId = "Destination AccountId is required."
            hasErrors = true;
        }

        if (transferDetail.sourceAccountId && transferDetail.destinationAccountId && transferDetail.sourceAccountId === transferDetail.destinationAccountId) {
            newErrors.destinationAccountId = 'Source and destination accounts must be different';
            hasErrors = true;
        }

        if (!transferDetail.amount) {
            newErrors.amount = 'Amount is required';
            hasErrors = true;
        } else if (parseFloat(transferDetail.amount) <= 0) {
            newErrors.amount = 'Amount must be greater than 0';
            hasErrors = true;
        }

        setErrors(newErrors);

        if (hasErrors) {
            return false;
        }
        return true
    }

    const handleTransferFundsClick = async () => {
        if (!isFormValid()) {
            return;
        }

        setIsLoading(true);
        const requestObj = {
            "source_account_id": parseInt(transferDetail.sourceAccountId),
            "destination_account_id": parseInt(transferDetail.destinationAccountId),
            "amount": transferDetail.amount
        }

        const response = await apiService.post(`/transactions`, requestObj);

        if (response.success) {
            setTransferResult({
                sourceAccount: transferDetail.sourceAccountId,
                destinationAccount: transferDetail.destinationAccountId,
                amount: transferDetail.amount,
            });
            setShowSuccessModal(true);

            setTransferDetail({
                sourceAccountId: '',
                destinationAccountId: '',
                amount: ''
            });
        } else {
            setError(response?.message ? response?.message[0].toUpperCase() + response.message.slice(1) : 'Transfer failed. Please try again.');
            setTimeout(() => setError(''), 5000);
        }

        setIsLoading(false);
    }

    const handleAccountClick = (account: Account) => {
        navigate('/account-details', { state: { accountId: account?.accountId } });
    };

    return (
        <div className="w-full min-h-96">
            <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Transfer Funds</h1>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">

                <div className="space-y-6">
                    <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
                        <h2 className="text-lg font-semibold mb-4">Fund Transfer</h2>
                        <p className="text-gray-600 mb-6 text-sm sm:text-base">
                            Transfer money between internal accounts
                        </p>

                        <div className="space-y-4">
                            <SearchableDropdown
                                label="Source Account ID"
                                value={transferDetail.sourceAccountId}
                                options={accountOptions}
                                onChange={(value) => {
                                    setTransferDetail(prev => ({ ...prev, sourceAccountId: value }));
                                    if (errors.sourceAccountId) {
                                        setErrors(prev => ({ ...prev, sourceAccountId: '' }));
                                    }
                                }}
                                placeholder="Enter Source Account Id"
                                error={errors.sourceAccountId}
                                allowCustomValue={true}
                            />
                            <SearchableDropdown
                                label="Destination Account ID"
                                value={transferDetail.destinationAccountId}
                                options={accountOptions}
                                onChange={(value) => {
                                    setTransferDetail(prev => ({ ...prev, destinationAccountId: value }));
                                    if (errors.destinationAccountId) {
                                        setErrors(prev => ({ ...prev, destinationAccountId: '' }));
                                    }
                                }}
                                placeholder="Ender Destination Account Id"
                                error={errors.destinationAccountId}
                                allowCustomValue={true}
                            />
                            <Input
                                id="transferAmount"
                                label={"Transfer Amount ($)"}
                                value={transferDetail.amount}
                                onChange={(e) => handleTransferDetailChange(e, 'amount')}
                                error={errors.amount}
                                type="number"
                            />
                        </div>

                        <Button
                            onClick={handleTransferFundsClick}
                            disabled={isLoading}
                            className="w-full mt-6"
                        >
                            {isLoading ? 'Processing Transfer...' : 'Transfer Funds'}
                        </Button>

                        {error && (
                            <div className="mt-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg flex items-start sm:items-center gap-2 text-red-700 text-sm sm:text-base">
                                <AlertCircle size={20} className="flex-shrink-0 mt-0.5 sm:mt-0" />
                                <span className="break-words">{error}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="xl:mt-0">
                    <AccountList
                        accounts={accountList}
                        title="Available Accounts"
                        onAccountClick={handleAccountClick}
                    />
                </div>
            </div>

            <SuccessModal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                title="Transfer Successful"
                message="Your fund transfer has been completed successfully!"
                details={transferResult}
            />

            <Loader isVisible={isLoading} />
        </div>
    )
}

export default TransferFunds;