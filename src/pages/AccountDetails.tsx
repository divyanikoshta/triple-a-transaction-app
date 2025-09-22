import { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import Button from "../components/ui/Button";
import SearchableDropdown from "../components/ui/SearchableDropdown";
import apiService from "../services/apiService";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { AlertCircle } from "lucide-react";
import Loader from "../components/ui/Loader";

type MessageType = 'error' | 'success';

interface AccountDetailProps {
    "account_id": number,
    "balance": string
}

const AccountDetails = () => {
    const [accountId, setAccountId] = useState<string>("")
    const [fieldErrors, setFieldErrors] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [accountData, setAccountData] = useState<AccountDetailProps | null>(null);
    const [showToastMsg, setShowToastMsg] = useState({
        message: '',
        type: ''
    })

    const location = useLocation();
    const selectedAccountId = location.state?.accountId;
    const { accountList } = useSelector((state: RootState) => state.account);

    const showMessage = (message: string, type: MessageType = 'error'): void => {
        setShowToastMsg({ message: message, type: type })
        setTimeout(() => {
            setShowToastMsg({ message: '', type: '' })
        }, 5000);
    };

    const accountOptions = accountList.map(account => ({
        value: account.accountId.toString(),
        label: account.accountId.toString(),
    }));

    const handleSearchAccountClick = async () => {
        if (!accountId) {
            setFieldErrors("Please enter Account ID");
            return;
        }

        setFieldErrors("");
        setIsLoading(true);

        try {
            const response = await apiService.get(`/accounts/${accountId}`);
            if (response.success) {
                setAccountData(JSON.parse(response.data));
            } else {
                showMessage(response?.message ? response?.message[0].toUpperCase() + response.message.slice(1) : "Failed to fetch account details");
                setAccountData(null);
            }
        } catch (error) {
            showMessage("An error occurred while fetching account details");
            console.error(error)
            setAccountData(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAccountIdChange = (value: string) => {
        const newVal = value.replace(/\D/g, '');
        setAccountId(newVal);
        if (fieldErrors) {
            setFieldErrors("");
        }
        if (accountData) {
            setAccountData(null);
        }
    };

    useEffect(() => {
        if (selectedAccountId) {
            setAccountId(selectedAccountId.toString());
        }
    }, [selectedAccountId]);

    return (
        <>
            <div className="w-full min-h-96">
                <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Search Account</h1>

                <div className="grid grid-cols-1 gap-6 lg:gap-8">
                    <div className="space-y-6">
                        <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
                            <h2 className="text-lg font-semibold mb-4">Account Search</h2>
                            <p className="text-gray-600 mb-6 text-sm sm:text-base">
                                Enter the account ID to fetch account details and balance
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="w-full sm:w-1/3">
                                    <SearchableDropdown
                                        label="Account ID"
                                        value={accountId}
                                        options={accountOptions}
                                        onChange={handleAccountIdChange}
                                        error={fieldErrors}
                                        allowCustomValue={true}
                                    />
                                </div>

                                <div className="flex items-start pt-6">
                                    <Button
                                        onClick={handleSearchAccountClick}
                                        disabled={isLoading}
                                        className="w-full sm:w-auto"
                                    >
                                        {isLoading ? 'Searching...' : 'Search Account'}
                                    </Button>
                                </div>
                            </div>

                            {accountData && (
                                <div className="flex flex-col sm:flex-row sm:items-center p-3 bg-gray-50 rounded w-full sm:w-fit mt-4 md:mt-0">
                                    <span className="font-medium text-gray-700 text-sm sm:text-base">Current Balance:</span>
                                    <span className="text-green-600 font-semibold text-sm sm:text-base">
                                        &nbsp;${parseFloat(accountData?.balance || '0')?.toLocaleString()}
                                    </span>
                                </div>
                            )}

                            {showToastMsg.type === 'error' && (
                                <div className="mt-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg flex items-start sm:items-center gap-2 text-red-700 text-sm sm:text-base w-full sm:w-1/3">
                                    <AlertCircle size={20} className="flex-shrink-0 mt-0.5 sm:mt-0" />
                                    <span className="break-words">{showToastMsg.message}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Loader isVisible={isLoading} />
        </>
    );
};

export default AccountDetails;