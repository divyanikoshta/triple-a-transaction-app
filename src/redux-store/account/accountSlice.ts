import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface Account {
    accountId: number;
    createdAt: string; // ISO date string
}

interface AccountState {
    accountList: Account[];
}

const initialState: AccountState = {
    accountList: [],
};

const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        addAccount: (state, action: PayloadAction<Account>) => {
            state.accountList.push(action.payload);
        },
    },
});

export const { addAccount } = accountSlice.actions;

export default accountSlice.reducer;
