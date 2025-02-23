import { CreateConnection  } from "@/config/mariadbConfig";

export class RecordRepository {
    AddRecord(auditId: number, balance: number, reason: string, receipt: ArrayBuffer, signature: string) {
        var DB = CreateConnection();
        const result = DB.execute("INSERT INTO Records (auditId, amount, reason, receipt, signature, approved, dateCreated) VALUES " +
            "(?, ?, ?, ?, ?, ?, ?)", 
            [auditId, balance, reason, receipt, signature, 0, new Date()],
        );
        return result
    }

    async GetRecordList(auditId: number) {
        const result: any = await new Promise((resolve, reject) => {
            var DB = CreateConnection();

            DB.query("SELECT *, UNIX_TIMESTAMP(dateCreated) as dateCreatedEpoch FROM Records WHERE auditId = ?", [auditId],
                function (err, results) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(results);
                    }
                });
        });

        return result
    }

    async UpdateRecord(id: number, receipt: ArrayBuffer, signature: string) {
        var DB = CreateConnection();
        const result = DB.execute("UPDATE Records SET " +
            "receipt = ?, " +
            "signature = ? " +
            "WHERE id = ?",
            [receipt, signature, id],
        );

        return result;
    }

    async DeleteRecordById(id: number) {
        var DB = CreateConnection();
        const result = DB.execute("DELETE FROM Records WHERE id = ?",
            [id]
        );
        return result;
    }
}