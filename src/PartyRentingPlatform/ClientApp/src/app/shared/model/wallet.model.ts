type PaymentStatus = 0 | 1 | 2

export interface IWallet {
    price?: number | null,
    returnUrl?: string | null
}


export interface IPaymentSuccess {
    amount: number,
    transactionNo: number,
    status: PaymentStatus
}

export interface IHistoryTransactions {

    "amount": number,
    "status": string,
    "createdAt": string,
    "transactionNo": string,
    "userId": string,
    "id": number

}