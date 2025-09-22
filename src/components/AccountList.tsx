import React from 'react';
import { Wallet, Calendar, Landmark } from 'lucide-react';

export interface Account {
  accountId: number;
  createdAt: string;
}

interface AccountListProps {
  accounts: Account[];
  title?: string;
  maxItems?: number;
  onAccountClick?: (account: Account) => void;
}

const AccountList: React.FC<AccountListProps> = ({
  accounts,
  title = "Recent Accounts",
  onAccountClick,
}) => {

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (accounts.length === 0) {
    return (
      <div className={`bg-gray-50 rounded-lg p-4 sm:p-6 text-center h-fit`}>
        <h2 className="text-base sm:text-lg font-semibold mb-4 text-gray-800">{title}</h2>
        <div className="flex flex-col items-center text-gray-500">
          <Wallet size={48} className="mb-2 opacity-50" />
          <p className="text-sm sm:text-base">No accounts available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 max-h-[calc(100vh-200px)] flex flex-col`}>
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex-shrink-0">
        <h2 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Landmark size={18} className="sm:w-5 sm:h-5" />
          <span>{title}</span>
        </h2>
      </div>

      <div className="divide-y divide-gray-100 overflow-y-auto flex-1">
        {accounts.map((account) => (
          <div
            key={account.accountId}
            className='p-3 sm:p-4 hover:bg-gray-50 transition-colors cursor-pointer'
            onClick={() => onAccountClick?.(account)}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-8 h-8 sm:w-8 sm:h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Wallet size={16} className="sm:w-5 sm:h-5 text-primary" />
                </div>
                <p className="font-medium text-gray-900 text-sm sm:text-base truncate">
                  Account Id #{account.accountId}
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500 flex-shrink-0">
                <Calendar size={12} className="sm:w-3.5 sm:h-3.5" />
                <span>{formatDate(account.createdAt)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountList;