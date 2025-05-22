"use client"

import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { ConfirmationDialog } from "@/components/confirmationDialog"
import { CircleOff, Edit, Save, SquareArrowOutUpRight, Trash } from "lucide-react"
import Audit from "@/models/Audit"

export function AuditRow({ audit, onSubmitDone, onDelete }: { audit : Audit, onSubmitDone : () => void, onDelete? : () => void }) {
  const [editMode, setEditMode] = useState(false)
  const [name, setName] = useState("")
  const [id, setId] = useState(0)

  useEffect(() => {
    setName(audit.name)
    setId(audit.id ?? 0)
  }, [audit.id, audit.name])

  const onSubmit = async () => {
    const fetchUrl = process.env.NEXT_PUBLIC_API_URL + "/api/audit/updateAudit";

    const formData = new FormData();
    formData.append("name", name);
    formData.append("id", id.toString());

    const res = await fetch(fetchUrl, {
      method: "PUT",
      body: formData
    })

    if (res.ok) {
      setEditMode(false);
      onSubmitDone()
    }
  }

  const onDeleteClicked = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL + "/api/audit/deleteAudit";

    const formData = new FormData();
    formData.append("id", audit.id?.toString() || "");

    const res = await fetch(apiUrl, {
      method: "DELETE",
      body: formData
    })

    if(res.ok) {
      if (onDelete) {
        onDelete();
      }
    }
  }

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  }

  return (
    <tr key={audit.id} className="text-center">
      {editMode && (
        <>
          <td>
            <Input type="text" name="name" value={name} onChange={onNameChange}/>
          </td>
          <td>{audit.entries}</td>
          <td>{audit.publicGuid}</td>
          <td>
            <Button onClick={() => setEditMode(false)} className="bg-rose-500"><CircleOff/></Button>
            <Button onClick={onSubmit} className="bg-emerald-300"><Save/></Button>
          </td>
        </>
      )}
      {!editMode && (
        <>
          <td>{audit.name}</td>
          <td>{audit.entries}</td>
          <td>{audit.publicGuid}</td>
          <td>
            <Button className="bg-sky-400"><a href={"/records/" + audit.publicGuid}><SquareArrowOutUpRight/></a></Button>
            <Button onClick={() => setEditMode(true)} className="bg-amber-500"><Edit/></Button>
            <ConfirmationDialog onYes={onDeleteClicked}>
              <Button className="bg-red-500"><Trash /></Button>
            </ConfirmationDialog>
          </td>
        </>
      )}
    </tr>
  )
}