export interface FabTokenBalance {
    address: string;
    comments: string;
    executionResult: ExecutionResult;
    transactionReceipt: TransactionReceipt;
}

export interface TransactionReceipt {
    bloom: string;
    gasUsed: number;
    stateRoot: string;
}


export interface ExecutionResult {
    codeDeposit: number;
    depositSize: number;
    excepted: string;
    gasForDeposit: number;
    gasRefunded: number;
    gasUsed: number;
    newAddress: string;
    output: string;
}