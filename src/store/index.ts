import { atom } from "jotai";

export const atomTransactionStatus = atom<
  | {
      isPending: boolean;
      isSuccessful?: boolean;
      isFailed?: boolean;
      transactionHash?: string;
      message?: string;
      rewardData?: any;
    }
  | undefined
>(undefined);
