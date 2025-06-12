"use client";

import { SetStateAction, useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageDialog } from "../../imageDialog";
import { SignatureDialog } from "../../signatureDialog";
import {
  Edit,
  SquareArrowOutUpRight,
  SquarePen,
  Trash,
  UserPlus,
  FilePlus,
  Search,
  ArrowDownUp,
  ArrowDownAZ,
  ArrowUpAZ,
} from "lucide-react";
import { RecordAddReceiptSignatureDialog } from "./recordAddReceiptSignatureDialog";
import { RecordRow } from "./recordRow";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RecordFilterDto } from "@/dto/record";
import { AuditRecordDto } from "@/dto/record/AuditRecordDto";
import { fetchRecordsReq } from "@/services/recordService";

type SortField = "reason" | "createdAt";
type SortDirection = "asc" | "desc";

export default function RecordManagement({ guid }: { guid: string }) {
  const [addBalanceInput, setBalanceInput] = useState("");
  const [currentBalance, setCurrentBalance] = useState(0);
  const [reasonInput, setReasonInput] = useState("");
  const [receiptInput, setReceiptInput] = useState<File | null>();
  const [signatureInput, setSignatureInput] = useState(null);
  const [runningBalance, setRunningBalance] = useState(0);
  const [isAddRecordDialogOpen, setIsAddRecordDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recordList, setRecordList] = useState<AuditRecordDto[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortState, setSortState] = useState<{
    field: SortField;
    direction: SortDirection;
  }>({
    field: "reason",
    direction: "asc",
  });
  const [filterRecordList, setFilterRecordList] = useState<RecordFilterDto>({
    reason: undefined,
    page: 1,
    pageSize: 10,
    orderBy: "reason",
    orderDirection: "asc",
  });

  useEffect(() => {
    fetchRecords();
  }, []);

  // const fetchRecords = async () => {
  //   const formData = new FormData();
  //   formData.append("guid", guid);

  //   const getOwnersUrl =
  //     process.env.NEXT_PUBLIC_API_URL + "/api/record/recordList";
  //   fetch(getOwnersUrl, {
  //     method: "POST",
  //     body: formData,
  //   })
  //     .then((res) => res.json())
  //     .then((dataList) => {
  //       let currentBalance: number | null = null;
  //       dataList.forEach(
  //         (currentValue: {
  //           createdAt: Date;
  //           amount: number | null;
  //           runningBalance: number | null;
  //         }) => {
  //           if (!currentBalance) {
  //             currentBalance = currentValue.amount;
  //           } else {
  //             currentBalance += currentValue.amount ?? 0;
  //           }
  //           currentValue.runningBalance = currentBalance;
  //           currentValue.createdAt = new Date(currentValue.createdAt);
  //         }
  //       );
  //       setCurrentBalance(currentBalance ?? 0);
  //       setRecordList(dataList);
  //     });
  // };

  const fetchRecords = useCallback(async () => {
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("guid", guid);

      const res = await fetchRecordsReq(formData, filterRecordList);

      if (res && res.data.records && res.data.total) {
        let currentBalance: number | null = null;

        res.data.records.forEach(
          (currentValue: {
            createdAt: Date;
            amount: number | null;
            runningBalance: number | null;
          }) => {
            currentBalance = !currentBalance
              ? currentValue.amount
              : currentBalance + (currentValue.amount ?? 0);

            currentValue.runningBalance = currentBalance;
            currentValue.createdAt = new Date(currentValue.createdAt);
          }
        );

        setCurrentBalance(currentBalance ?? 0);
        setRecordList(res.data.records);
      }
    } catch (error) {
      console.error("Failed to fetch records:", error);
    } finally {
      setIsLoading(false);
    }
  }, [filterRecordList, guid]);

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
      body: formData,
    });

    if (res.ok) {
      setBalanceInput("");
      setReasonInput("");
      setReceiptInput(null);
      setSignatureInput(null);
      fetchRecords();
    }
  };

  const onAddAuditNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBalanceInput(e.target.value);
  };

  const onReasonInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReasonInput(e.target.value);
  };

  const onReceiptInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      let file = e.target.files[0];

      setReceiptInput(file);
    }
  };

  const onSignatureInputChange = (e: { base64: SetStateAction<null> }) => {
    setSignatureInput(e.base64);
  };

  const toggleSort = (field: SortField) => {
    const isSameField = sortState.field === field;
    const newDirection: SortDirection =
      isSameField && sortState.direction === "asc" ? "desc" : "asc";

    const newSortState = {
      field,
      direction: newDirection,
    };

    setSortState(newSortState);

    handleChangeTable({
      orderBy: field,
      orderDirection: newSortState.direction,
    });
  };

  const handleChangeTable = (changes: Partial<RecordFilterDto>) => {
    setFilterRecordList((prev) => ({
      ...prev,
      ...changes,
      ...(changes.pageSize && { page: 1 }),
    }));
  };

  const getSortIcon = (field: SortField) => {
    if (sortState.field !== field) {
      return <ArrowDownUp className="h-4 w-4 opacity-50" />;
    }
    return sortState.direction === "asc" ? (
      <ArrowDownAZ className="h-4 w-4" />
    ) : (
      <ArrowUpAZ className="h-4 w-4" />
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full border">
        <div>
          <CardTitle>Public Audit Records</CardTitle>
          <CardDescription>
            View and submit entries to the public audit trail. All submissions
            are open and transparent.
          </CardDescription>
        </div>

        <div className="sm:ml-auto mt-4 sm:mt-0">
          <Button
            onClick={() => setIsAddRecordDialogOpen(true)}
            disabled={isLoading}
          >
            <FilePlus className="h-4 w-4 mr-2" />
            Add Record
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="mb-4 space-y-4 pt-4">
          {/* Search bar */}
          <div className="flex items-center gap-2 w-full ">
            <Input
              placeholder="Search by name or GUID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value.trim())}
            />
            <Button size="icon" variant="outline" disabled={true}>
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {/* Sort controls */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground self-center">
              Sort by:
            </span>
            <Button
              variant={sortState.field === "reason" ? "default" : "outline"}
              size="sm"
              onClick={() => toggleSort("reason")}
              className="flex items-center gap-1"
            >
              {getSortIcon("reason")}
              Name
            </Button>
            <Button
              variant={sortState.field === "createdAt" ? "default" : "outline"}
              size="sm"
              onClick={() => toggleSort("createdAt")}
              className="flex items-center gap-1"
            >
              {getSortIcon("createdAt")}
              Date Created
            </Button>

            {searchQuery && (
              <Badge variant="outline" className="ml-auto">
                {recordList.length} results
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
                      Balance
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Reason
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Receipt
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Signature
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Running Balance
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Date Created
                    </th>

                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recordList.length > 0 ? (
                    recordList.map((record) => (
                      <RecordRow
                        key={record.id}
                        record={recordList}
                        onSubmitDone={fetchRecords}
                      />
                    ))
                  ) : (
                    <tr className="border-b transition-colors hover:bg-muted/50">
                      <td
                        colSpan={5}
                        className="p-4 align-middle text-center text-muted-foreground"
                      >
                        {searchQuery
                          ? "No matching records found"
                          : "No record found"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {/* {!isLoading && ownerList.length > 0 && (
          <TableFooter
            filterList={filterOwnerList}
            totalCount={totalCount}
            handleChangeTable={handleChangeTable}
            isLoading={isLoading}
          />
        )} */}
      </CardContent>

      {/* <DialogForm
        open={isAddOwnerDialogOpen}
        onOpenChange={setIsAddOwnerDialogOpen}
        onSubmit={handleAddOwner}
        isLoading={isLoading}
        title="Add New Owner"
        description="Create a new owner account with username and password."
        icon={<UserPlus className="h-5 w-5 text-emerald-500" />}
        successMessage="Owner added successfully!"
        errorMessage="Failed to add owner. Please try again."
        submitText="Add Owner"
        fields={[
          {
            id: "username",
            label: "Username",
            placeholder: "Enter username",
            required: true,
          },
          {
            id: "password",
            label: "Password",
            type: "password",
            placeholder: "Enter password",
            required: true,
          },
          {
            id: "confirmPassword",
            label: "Confirm Password",
            type: "password",
            placeholder: "Re-enter password",
            required: true,
          },
        ]}
      /> */}
    </Card>
    // <div>
    //   <div className="flex flex-col h-screen">
    //     <div className="flex flex-row">
    //       <h1 className="h-35">Auditss</h1>
    //       <h1 className="h-35">Current Balance: {currentBalance}</h1>
    //     </div>

    //     <div className="flex flex-col space-y-2 ">
    //       <div className="flex flex-row">
    //         <Input
    //           value={addBalanceInput}
    //           onChange={onAddAuditNameChange}
    //           placeholder="Amount"
    //           type="number"
    //         />
    //         <Input
    //           value={reasonInput}
    //           onChange={onReasonInputChange}
    //           placeholder="Reason"
    //         />

    //         <Input
    //           onChange={onReceiptInputChange}
    //           type="file"
    //           accept=".png,.jpg,.jpeg"
    //           className="icon-upload"
    //         />
    //         <SignatureDialog
    //           value={signatureInput}
    //           onChange={onSignatureInputChange}
    //         />
    //       </div>

    //       <Button onClick={addRecord} className="bg-emerald-300">
    //         <SquarePen />
    //       </Button>
    //     </div>

    //     <table>
    //       <thead>
    //         <tr>
    //           <th>Balance</th>
    //           <th>Reason</th>
    //           <th>Has Receipt</th>
    //           <th>Has Signature</th>
    //           <th>Running Balance</th>
    //           <th>Date Entered</th>
    //           <th>Actions</th>
    //         </tr>
    //       </thead>
    //       <tbody>
    //         {recordList?.length > 0 ? (
    //           recordList?.map((audit) => (
    //             <RecordRow
    //               key={audit.id}
    //               audit={audit}
    //               onEditSuccess={fetchRecords}
    //               onDeleteSuccess={fetchRecords}
    //             ></RecordRow>
    //           ))
    //         ) : (
    //           <tr>
    //             <td colSpan={5} className="text-center">
    //               No Records Found
    //             </td>
    //           </tr>
    //         )}
    //       </tbody>
    //     </table>
    //   </div>
    // </div>
  );
}
