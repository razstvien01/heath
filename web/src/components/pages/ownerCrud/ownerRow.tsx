"use client"

import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"

export function OwnerRow({ owner, onSubmitDone }: { owner : Owner, onSubmitDone : () => void }) {
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
            <Button onClick={() => setEditMode(false)}>Cancel</Button>
            <Button onClick={onSubmit}>Save</Button>
          </td>
        </>
      )}
      {!editMode && (
        <>
          <td>{owner.name}</td>
          <td>********</td>
          <td>{owner.managementGuid}</td>
          <td>
            <Button onClick={() => setEditMode(true)}>Edit</Button>
            <Button>Delete</Button>
          </td>
        </>
      )}
    </tr>
  )
}