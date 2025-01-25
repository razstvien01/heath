import { CreateConnection  } from "@/config/mariadbConfig";

export class RecordRepository {
    AddRecord(auditId: number, balance: number, reason: string, receipt: ArrayBuffer, signature: string) {
        var DB = CreateConnection();
        const result = DB.execute("INSERT INTO Records (auditId, amount, reason, receipt, signature, approved) VALUES " +
            "(?, ?, ?, ?, ?, ?)", 
            [auditId, balance, reason, receipt, signature, 0],
        );
        return result
    }

    async GetRecordList(auditId: number) {
        const result: any = await new Promise((resolve, reject) => {
            var DB = CreateConnection();

            DB.query("SELECT * FROM Records WHERE auditId = ?", [auditId],
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
}