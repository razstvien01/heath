"use client"

import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"

export function AuditRow({ audit, onSubmitDone }: { audit : Audit, onSubmitDone : () => void }) {
  const [editMode, setEditMode] = useState(false)
  const [name, setName] = useState("")
  const [id, setId] = useState(0)

  useEffect(() => {
    setName(audit.name)
    setId(audit.id ?? 0)
  }, [])

  const onSubmit = async () => {
    const fetchUrl = process.env.NEXT_PUBLIC_API_URL + "/api/audit/updateAudit";

    const formData = new FormData();
    formData.append("name", name);
    formData.append("id", id.toString());

    const res = await fetch(fetchUrl, {
      method: "POST",
      body: formData
    })

    if (res.ok) {
      setEditMode(false);
      onSubmitDone()
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
            <Button onClick={() => setEditMode(false)}>Cancel</Button>
            <Button onClick={onSubmit}>Save</Button>
          </td>
        </>
      )}
      {!editMode && (
        <>
          <td>{audit.name}</td>
          <td>{audit.entries}</td>
          <td>{audit.publicGuid}</td>
          <td>
            <Button>Open</Button>
            <Button onClick={() => setEditMode(true)}>Edit</Button>
            <Button>Delete</Button>
          </td>
        </>
      )}
    </tr>
  )
}