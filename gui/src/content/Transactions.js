import React from 'react'
import { BalanceViewer } from '../components/BalanceViewer'
import { AddressViewer } from '../components/AddressViewer'
import { TransactionList } from '../components/TransactionList'





export const transactionsPage = ( 
    <>
        <AddressViewer></AddressViewer>
        <BalanceViewer></BalanceViewer>
        <hr className="relative top-16 border-y-2"></hr>
        <TransactionList></TransactionList>
    </>
) 