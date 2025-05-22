"use client"

import { SetStateAction, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageDialog } from "../../imageDialog";
import { SignatureDialog } from "../../signatureDialog";
import { Edit, SquareArrowOutUpRight, SquarePen, Trash } from "lucide-react";
import { RecordAddReceiptSignatureDialog } from "./recordAddReceiptSignatureDialog";
import { RecordRow } from "./recordRow";
import AuditRecord from "@/models/AuditRecord";

export default function RecordCrud({ guid }: { guid: string }) {
    const [addBalanceInput, setBalanceInput] = useState("");
    const [currentBalance, setCurrentBalance] = useState(0);
    const [reasonInput, setReasonInput] = useState("")
    const [receiptInput, setReceiptInput] = useState<File | null>()
    const [signatureInput, setSignatureInput] = useState(null)
    const [runningBalance, setRunningBalance] = useState(0)

    
    const [recordList, setRecordList] = useState<AuditRecord[]>([]);

    useEffect(() => {
        fetchRecords();
    }, [])

    const fetchRecords = async () => {
        const formData = new FormData();
        formData.append("guid", guid);

        const getOwnersUrl = process.env.NEXT_PUBLIC_API_URL + "/api/record/recordList";
        fetch(getOwnersUrl, {
            method: "POST",
            body: formData
        })
            .then(res => res.json())
            .then((dataList) => {
                let currentBalance: number | null = null
                dataList.forEach((currentValue: {
                    createdAt: Date;
                    amount: number | null; 
                    runningBalance: number | null; 
                    }) => {
                    if(!currentBalance) {
                        currentBalance = currentValue.amount
                    } else {
                        currentBalance += currentValue.amount ?? 0
                    }
                    currentValue.runningBalance = currentBalance
                    currentValue.createdAt = new Date(currentValue.createdAt)
                })
                setCurrentBalance(currentBalance ?? 0);
                setRecordList(dataList)
            })
    }

    const addRecord = async () => {
        const fetchUrl = process.env.NEXT_PUBLIC_API_URL + "/api/record/addRecord";

        const formData = new FormData();
        formData.append("guid", guid);
        formData.append("amount", addBalanceInput);
        formData.append("reason", reasonInput);
        if (receiptInput) {
            formData.append("receipt", receiptInput);
        }
        if (signatureInput) {
            formData.append("signature", signatureInput);
        }

        const res = await fetch(fetchUrl, {
            method: "POST",
            body: formData
        })

        if (res.ok) {
            setBalanceInput("")
            setReasonInput("")
            setReceiptInput(null)
            setSignatureInput(null)
            fetchRecords();
        }
    }

    const onAddAuditNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBalanceInput(e.target.value);
    }

    const onReasonInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setReasonInput(e.target.value);
    }

    const onReceiptInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            let file = e.target.files[0];

            setReceiptInput(file);
        }
    }

    const onSignatureInputChange = (e: { base64: SetStateAction<null>; }) => {
        setSignatureInput(e.base64);
    }

    return (
        <div>
            <div className="flex flex-col h-screen">
                <div className="flex flex-row">
                    <h1 className="h-35">Audits</h1>
                    <h1 className="h-35">Current Balance: {currentBalance}</h1>
                </div>

                <div className="flex flex-col space-y-2 ">
                    <div className="flex flex-row">
                        <Input value={addBalanceInput} onChange={onAddAuditNameChange} placeholder="Amount" type="number" />
                        <Input value={reasonInput} onChange={onReasonInputChange} placeholder="Reason" />

                        <Input onChange={onReceiptInputChange} type="file" accept=".png,.jpg,.jpeg" className="icon-upload"/>
                        <SignatureDialog value={signatureInput} onChange={onSignatureInputChange}/>
                    </div>

                    <Button onClick={addRecord} className="bg-emerald-300"><SquarePen/></Button>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Balance</th>
                            <th>Reason</th>
                            <th>Has Receipt</th>
                            <th>Has Signature</th>
                            <th>Running Balance</th>
                            <th>Date Entered</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recordList?.length > 0 ? (
                            recordList?.map((audit) => (
                                <RecordRow key={audit.id} audit={audit} onEditSuccess={fetchRecords} onDeleteSuccess={fetchRecords}></RecordRow>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="text-center">
                                    No Records Found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}