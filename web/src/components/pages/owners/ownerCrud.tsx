"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { OwnerRow } from "./ownerRow"
import { ArrowDownAZ, ArrowDownUp, ArrowUpAZ, LogIn, Search, UserPlus } from "lucide-react"
import type Owner from "@/models/Owner"
import { confirmAdminLoginReq } from "@/services/adminService"
import { addOwnerReq, fetchOwnersReq } from "@/services/ownerService"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type SortField = "name" | "dateCreated"
type SortDirection = "asc" | "desc"

export default function OwnerCrud({ guid }: { guid: string }) {
  const [loggedInState, setLoggedInState] = useState(false)
  const [invalidLoginState, setInvalidLoginState] = useState(false)
  const [adminUsername, setAdminUsername] = useState("")
  const [adminPassword, setAdminPassword] = useState("")

  const [addOwnerNameInput, setAddOwnerNameInput] = useState("")
  const [addOwnerPasswordInput, setAddOwnerPasswordInput] = useState("")

  const [ownerList, setOwnerList] = useState<Owner[]>([])
  const [filteredOwnerList, setFilteredOwnerList] = useState<Owner[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [sortField, setSortField] = useState<SortField>("name")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (loggedInState) {
      fetchOwners()
    }
  }, [loggedInState])

  useEffect(() => {
    // Filter and sort owners whenever the list, search query, or sort parameters change
    let result = [...ownerList]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (owner) => owner.name.toLowerCase().includes(query) || owner.managementGuid.toLowerCase().includes(query),
      )
    }

    // Apply sorting
    result.sort((a, b) => {
      if (sortField === "name") {
        return sortDirection === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      } else {
        const dateA = new Date(a.createdAt || 0).getTime()
        const dateB = new Date(b.createdAt || 0).getTime()
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA
      }
    })

    setFilteredOwnerList(result)
  }, [ownerList, searchQuery, sortField, sortDirection])

  const confirmAdminLogin = async () => {
    if (!adminUsername || !adminPassword) return

    setIsLoading(true)
    setInvalidLoginState(false)

    try {
      const res = await confirmAdminLoginReq(guid, adminUsername, adminPassword)

      if (res) {
        setLoggedInState(true)
      } else {
        setInvalidLoginState(true)
      }
    } catch (error) {
      setInvalidLoginState(true)
      console.error("Error confirming admin login:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchOwners = async () => {
    setIsLoading(true)

    try {
      const res = await fetchOwnersReq()

      if (res) {
        setOwnerList(res.data)
      }
    } catch (error) {
      console.error("Failed to fetch owners:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const addOwner = async () => {
    if (!addOwnerNameInput || !addOwnerPasswordInput) return

    setIsLoading(true)

    const formData = new FormData()
    formData.append("username", addOwnerNameInput)
    formData.append("password", addOwnerPasswordInput)

    try {
      const res = await addOwnerReq(formData)
      if (res) {
        setAddOwnerNameInput("")
        setAddOwnerPasswordInput("")
        fetchOwners()
      }
    } catch (error) {
      console.error("Error adding owner:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      confirmAdminLogin()
    }
  }

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      // Set new field and default to ascending
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowDownUp className="h-4 w-4 opacity-50" />
    }
    return sortDirection === "asc" ? <ArrowDownAZ className="h-4 w-4" /> : <ArrowUpAZ className="h-4 w-4" />
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {!loggedInState ? (
        <div className="flex justify-center items-center min-h-[80vh]">
          <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
              <CardDescription className="text-center">
                Enter your credentials to access the owner management
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Input
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  placeholder="Username"
                  onKeyDown={handleKeyDown}
                />
              </div>
              <div className="space-y-2">
                <Input
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Password"
                  type="password"
                  onKeyDown={handleKeyDown}
                />
              </div>
              {invalidLoginState && <p className="text-red-500 text-sm text-center">Invalid login credentials</p>}
            </CardContent>
            <CardFooter>
              <Button
                onClick={confirmAdminLogin}
                className="w-full"
                disabled={isLoading || !adminUsername || !adminPassword}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                    Logging in...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    Login
                  </span>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Owner Management</h1>
            <Button variant="outline" onClick={() => setLoggedInState(false)}>
              Logout
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Add New Owner</CardTitle>
              <CardDescription>Create a new owner account with username and password</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  value={addOwnerNameInput}
                  onChange={(e) => setAddOwnerNameInput(e.target.value)}
                  placeholder="Username"
                  className="flex-1"
                />
                <Input
                  value={addOwnerPasswordInput}
                  onChange={(e) => setAddOwnerPasswordInput(e.target.value)}
                  placeholder="Password"
                  type="password"
                  className="flex-1"
                />
                <Button
                  onClick={addOwner}
                  className="bg-emerald-500 hover:bg-emerald-600"
                  disabled={isLoading || !addOwnerNameInput || !addOwnerPasswordInput}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Owner
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Owner List</CardTitle>
              <CardDescription>Manage existing owner accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 space-y-4">
                {/* Search bar */}
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or GUID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>

                {/* Sort controls */}
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-muted-foreground self-center">Sort by:</span>
                  <Button
                    variant={sortField === "name" ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleSort("name")}
                    className="flex items-center gap-1"
                  >
                    {getSortIcon("name")}
                    Name
                  </Button>
                  <Button
                    variant={sortField === "dateCreated" ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleSort("dateCreated")}
                    className="flex items-center gap-1"
                  >
                    {getSortIcon("dateCreated")}
                    Date Created
                  </Button>

                  {searchQuery && (
                    <Badge variant="outline" className="ml-auto">
                      {filteredOwnerList.length} results
                    </Badge>
                  )}
                </div>
              </div>

              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
              ) : (
                <div className="rounded-md border">
                  <div className="w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                      <thead className="border-b">
                        <tr className="border-b transition-colors hover:bg-muted/50">
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                            Username
                          </th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                            Password
                          </th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Guid</th>
                          <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                            Date Created
                          </th>
                          <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredOwnerList.length > 0 ? (
                          filteredOwnerList.map((owner) => (
                            <OwnerRow key={owner.id} owner={owner} onSubmitDone={fetchOwners} onDelete={fetchOwners} />
                          ))
                        ) : (
                          <tr className="border-b transition-colors hover:bg-muted/50">
                            <td colSpan={5} className="p-4 align-middle text-center text-muted-foreground">
                              {searchQuery ? "No matching owners found" : "No owners found"}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
