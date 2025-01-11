"use client"

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"

export default function PrivateRecordCrud({ guid }: { guid: string }) {
    const [loggedInState, setLoggedInState] = useState(true);
    const [invalidLoginState, setInvalidLoginState] = useState(false);
    const [adminUsername, setAdminUsername] = useState("");
    const [adminPassword, setAdminPassword] = useState("");

    const [addBalanceInput, setBalanceInput] = useState("");
    const [currentBalance, setCurrentBalance] = useState(0);

    interface AuditRecord {
        id: number | null | undefined;
        amount: number;
        dateEntered: Date;
        hasReceipt: boolean;
        hasSignature: boolean;
        runningBalance: number;
    }

    const [auditList, setAuditList] = useState<AuditRecord[]>([]);

    useEffect(() => {
        if (loggedInState) {
            fetchAudits();
        }
    }, [loggedInState])

    const confirmAdminLogin = async () => {
        const confirmAdminUrl = process.env.NEXT_PUBLIC_BASE_URL + "/api/confirmAdminLogin";

        const formData = new FormData();
        formData.append("guid", guid);
        formData.append("username", adminUsername);
        formData.append("password", adminPassword);

        const res = await fetch(confirmAdminUrl, {
            method: "POST",
            body: formData,
        });

        if (res.ok) {
            setLoggedInState(true);
        } else {
            setInvalidLoginState(true);
        }
    }

    const fetchAudits = async () => {
        const getOwnersUrl = process.env.NEXT_PUBLIC_BASE_URL + "/api/ownersList";
        fetch(getOwnersUrl, {
            method: "POST",
        })
            .then(res => res.json())
            .then(data => {
                setAuditList(data)
            })
    }

    const addAudit = async () => {
        const fetchUrl = process.env.NEXT_PUBLIC_BASE_URL + "/api/addOwner";

        const formData = new FormData();
        formData.append("username", addBalanceInput);

        const res = await fetch(fetchUrl, {
            method: "POST",
            body: formData
        })

        if (res.ok) {
            fetchAudits();
        }
    }

    const onAdminUserNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAdminUsername(e.target.value);
    }

    const onAdminPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAdminPassword(e.target.value);
    }

    const onAddAuditNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBalanceInput(e.target.value);
    }

    return (
        <div>
            {!loggedInState && (
                <div className="space-y-2 px-5 place-content-center h-screen w-screen">
                    <Input value={adminUsername} onChange={onAdminUserNameChange} placeholder="Username" />
                    <Input value={adminPassword} onChange={onAdminPasswordChange} placeholder="Password" type="password" />
                    <Button onClick={confirmAdminLogin} className="w-full">Login</Button>
                    {invalidLoginState && (
                        <p className="text-red-500">Invalid login credentials</p>
                    )}
                </div>
            )}
            {loggedInState && (
                <div className="flex flex-col h-screen">

                    <div className="flex flex-row">
                        <h1 className="h-35">Audits</h1>
                        <h1 className="h-35">Current Balance: {currentBalance}</h1>
                    </div>

                    <div className="flex flex-row">
                        <Input value={addBalanceInput} onChange={onAddAuditNameChange} placeholder="Amount" type="number" />
                        <Input value={addBalanceInput} onChange={onAddAuditNameChange} placeholder="Reason" />
                        <Button onClick={addAudit}>Add Record</Button>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>Audit Name</th>
                                <th>Entries</th>
                                <th>Public Guid</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {auditList?.length > 0 ? (
                                auditList?.map((audit) => (
                                    <tr key={audit.id}>
                                        <td>{audit.amount}</td>
                                        <td>
                                            <Button>Open</Button>
                                            <Button>Edit</Button>
                                            <Button>Delete</Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3} className="text-center">
                                        No Audits Found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}