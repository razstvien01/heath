"use client"

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { AuditRow } from "./auditRow";

export default function AuditCrud({ guid }: { guid: string }) {
    const [loggedInState, setLoggedInState] = useState(false);
    const [invalidLoginState, setInvalidLoginState] = useState(false);
    const [ownerUsername, setOwnerUsername] = useState("");
    const [ownerPassword, setOwnerPassword] = useState("");

    const [addAuditNameInput, setAuditNameInput] = useState("");

    const [auditList, setAuditList] = useState<Audit[]>([]);

    useEffect(() => {
        if (loggedInState) {
            fetchAudits();
        }
    }, [loggedInState])

    const confirmOwnerLogin = async () => {
        const confirmAdminUrl = process.env.NEXT_PUBLIC_API_URL + "/api/owner/confirmOwnerLogin";

        const formData = new FormData();
        formData.append("guid", guid);
        formData.append("username", ownerUsername);
        formData.append("password", ownerPassword);

        const res = await fetch(confirmAdminUrl, {
            method: "POST",
            body: formData
        });

        if (res.ok) {
            setLoggedInState(true);
        } else {
            setInvalidLoginState(true);
        }
    }

    const fetchAudits = async () => {
        const getOwnersUrl = process.env.NEXT_PUBLIC_API_URL + "/api/audit/auditList";

        const formData = new FormData();
        formData.append("guid", guid);

        fetch(getOwnersUrl, {
            method: "POST",
            body: formData
        })
            .then(res => res.json())
            .then(data => {
                setAuditList(data)
            })
    }

    const addAudit = async () => {
        const fetchUrl = process.env.NEXT_PUBLIC_API_URL + "/api/audit/addAudit";

        const formData = new FormData();
        formData.append("guid", guid);
        formData.append("name", addAuditNameInput);

        const res = await fetch(fetchUrl, {
            method: "POST",
            body: formData
        })

        if (res.ok) {
            fetchAudits();
        }
    }

    const onAdminUserNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOwnerUsername(e.target.value);
    }

    const onAdminPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOwnerPassword(e.target.value);
    }

    const onAddAuditNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAuditNameInput(e.target.value);
    }

    return (
        <div>
            {!loggedInState && (
                <div className="space-y-2 px-5 place-content-center h-screen w-screen">
                    <Input value={ownerUsername} onChange={onAdminUserNameChange} placeholder="Username" />
                    <Input value={ownerPassword} onChange={onAdminPasswordChange} placeholder="Password" type="password" />
                    <Button onClick={confirmOwnerLogin} className="w-full">Login</Button>
                    {invalidLoginState && (
                        <p className="text-red-500">Invalid login credentials</p>
                    )}
                </div>
            )}
            {loggedInState && (
                <div className="flex flex-col h-screen">
                    <h1 className="h-35">Audits</h1>

                    <div className="flex flex-row">
                        <Input value={addAuditNameInput} onChange={onAddAuditNameChange} placeholder="Audit Name" />
                        <Button onClick={addAudit}>Add Audit</Button>
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
                                   <AuditRow audit={audit} onSubmitDone={fetchAudits}/>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="text-center">
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