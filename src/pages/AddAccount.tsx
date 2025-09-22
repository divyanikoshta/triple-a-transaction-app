import { useState } from "react";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import apiService from "../services/apiService";
import { addAccount } from "../redux-store/account/accountSlice";
import type { AppDispatch, RootState } from "../store";
import { useDispatch, useSelector } from "react-redux";
import { AlertCircle, CheckCircle } from "lucide-react";
import AccountList, { type Account } from "../components/AccountList";
import { useNavigate } from 'react-router-dom';
import Loader from "../components/ui/Loader";

interface NewAccountForm {
    accountId: string;
    initialBalance: string;
}

type MessageType = 'error' | 'success';

const AddAccount = () => {
    const [newAccount, setNewAccount] = useState<NewAccountForm>({
        accountId: '',
        initialBalance: ''
    });

    const [fieldErrors, setFieldErrors] = useState({
        accountId: '',
        initialBalance: ''
    });

    const [showToastMsg, setShowToastMsg] = useState({
        message: '',
        type: ''
    })

    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const showMessage = (message: string, type: MessageType = 'error'): void => {
        setShowToastMsg({ message: message, type: type })
        setTimeout(() => {
            setShowToastMsg({ message: '', type: '' })
        }, 5000);
    };

    const { accountList } = useSelector((state: RootState) => state.account);
    const dispatch = useDispatch<AppDispatch>();

    const handleAccountInputChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
        let value = e.target.value;
        if (key === 'accountId') {
            const raw = e.target.value;
            value = raw.replace(/\D/g, '');
        }

        setNewAccount(prev => ({ ...prev, [key]: value }))
        if (fieldErrors[key as keyof typeof fieldErrors]) {
            setFieldErrors(prev => ({ ...prev, [key]: '' }));
        }
    }

    const isFormValid = () => {
        let hasErrors = false;
        const newErrors = { accountId: '', initialBalance: '' };
        if (!newAccount.accountId) {
            newErrors.accountId = 'Account ID is required';
            hasErrors = true;
        } else if (newAccount.accountId.length < 3) {
            newErrors.accountId = 'Account ID should be greater then or equal to 3 digit';
            hasErrors = true;
        } else if (newAccount.accountId.length > 12) {
            newErrors.accountId = 'Account ID should be less then or equal to 12 digit';
            hasErrors = true;
        }

        if (!newAccount.initialBalance) {
            newErrors.initialBalance = 'Initial Balance is required';
            hasErrors = true;
        } else if (parseFloat(newAccount.initialBalance) < 0) {
            newErrors.initialBalance = 'Initial Balance cannot be negative';
            hasErrors = true;
        }

        setFieldErrors(newErrors);

        if (hasErrors) {
            return false;
        }

        return true
    }

    const handleCreateAccountClick = async () => {
        if (!isFormValid()) {
            return;
        }

        setIsLoading(true)
        const requestObj = {
            "account_id": parseInt(newAccount.accountId),
            "initial_balance": newAccount.initialBalance
        }
        const response = await apiService.post(`/accounts`, requestObj);
        if (response.success) {
            showMessage(`Account ${newAccount.accountId} created successfully!`, 'success');
            dispatch(addAccount({
                accountId: parseInt(newAccount.accountId),
                createdAt: new Date().toISOString(),
            }));

            setNewAccount({
                accountId: '',
                initialBalance: ''
            })

        } else {
            showMessage(response.data ? response?.data[0].toUpperCase() + response.data.slice(1) : "Failed to add account", 'error')
        }

        setIsLoading(false)
    }

    const handleAccountClick = (account: Account) => {
        navigate('/account-details', { state: { accountId: account?.accountId } });
    }

    return (
        <>
            <div className="w-full min-h-96">
                <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Add New Account</h1>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
                    <div className="space-y-6">
                        <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
                            <h2 className="text-lg font-semibold mb-4">Create New Account</h2>
                            <p className="text-gray-600 mb-6 text-sm sm:text-base">
                                Create a new financial account with initial balance
                            </p>

                            <div className="space-y-4">
                                <Input
                                    id="accountId"
                                    label={"Account ID"}
                                    type="number"
                                    value={newAccount.accountId}
                                    onChange={(e) => handleAccountInputChange(e, 'accountId')}
                                    error={fieldErrors.accountId}
                                    pattern="^[0-9]+$"
                                />
                                <Input
                                    id="initialBalance"
                                    label={"Initial Balance ($)"}
                                    type="number"
                                    value={newAccount.initialBalance}
                                    onChange={(e) => handleAccountInputChange(e, 'initialBalance')}
                                    error={fieldErrors.initialBalance}
                                />
                            </div>

                            <Button
                                onClick={handleCreateAccountClick}
                                disabled={isLoading}
                                className="w-full mt-6"
                            >
                                {isLoading ? 'Creating Account...' : 'Create Account'}
                            </Button>

                            {showToastMsg.type === 'error' && (
                                <div className="mt-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg flex items-start sm:items-center gap-2 text-red-700 text-sm sm:text-base">
                                    <AlertCircle size={20} className="flex-shrink-0 mt-0.5 sm:mt-0" />
                                    <span className="break-words">{showToastMsg.message}</span>
                                </div>
                            )}

                            {showToastMsg.type === 'success' && (
                                <div className="mt-4 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg flex items-start sm:items-center gap-2 text-green-700 text-sm sm:text-base">
                                    <CheckCircle size={20} className="flex-shrink-0 mt-0.5 sm:mt-0" />
                                    <span className="break-words">{showToastMsg.message}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="xl:mt-0">
                        <AccountList
                            accounts={accountList}
                            title="Recently Added Accounts"
                            maxItems={5}
                            onAccountClick={handleAccountClick}
                        />
                    </div>
                </div>
            </div>
            <Loader isVisible={isLoading} />
        </>
    )
}

export default AddAccount;