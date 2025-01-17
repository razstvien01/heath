"use client"

import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { CircleOff, Edit, Save, Trash } from "lucide-react"
import { ConfirmationDialog } from "@/components/ui/confirmationDialog"

export function OwnerRow({ owner, onSubmitDone, onDelete }: { owner : Owner, onSubmitDone : () => void, onDelete? : () => void }) {
  const [editMode, setEditMode] = useState(false)
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [guid, setGuid] = useState("")

  useEffect(() => {
    setName(owner.name)
    setGuid(owner.managementGuid)
  }, [])

  const onSubmit = async () => {
    const fetchUrl = process.env.NEXT_PUBLIC_API_URL + "/api/owner/updateOwner";

    const formData = new FormData();
    formData.append("username", name);
    formData.append("password", password);
    formData.append("guid", owner.managementGuid);

    const res = await fetch(fetchUrl, {
      method: "POST",
      body: formData
    })

    if (res.ok) {
      setEditMode(false);
      onSubmitDone()
    }
  }

  const onDeleteClicked = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL + "/api/owner/deleteOwner";

    const formData = new FormData();
    formData.append("guid", owner.managementGuid);

    const res = await fetch(apiUrl, {
      method: "POST",
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

  const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }

  return (
    <tr key={owner.id}>
      {editMode && (
        <>
          <td>
            <Input type="text" name="name" value={name} onChange={onNameChange}/>
          </td>
          <td>
            <Input type="password" name="password" value={password} onChange={onPasswordChange} placeholder="********"/>
          </td>
          <td>{owner.managementGuid}</td>
          <td>
            <Button onClick={() => setEditMode(false)} className="bg-rose-500"><CircleOff/></Button>
            <Button onClick={onSubmit} className="bg-emerald-300"><Save/></Button>
          </td>
        </>
      )}
      {!editMode && (
        <>
          <td>{owner.name}</td>
          <td>********</td>
          <td>{owner.managementGuid}</td>
          <td>
            <Button onClick={() => setEditMode(true)} className="bg-sky-400"><Edit/></Button>
            <ConfirmationDialog onYes={onDeleteClicked}>
              <Button className="bg-red-500"><Trash/></Button>
            </ConfirmationDialog>
          </td>
        </>
      )}
    </tr>
  )
}