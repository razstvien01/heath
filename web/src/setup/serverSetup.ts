import { CreateConnection } from "@/config/mariadbConfig";
import { v4 as uuidv4 } from "uuid";
import { QueryResult } from "mysql2";

export function Setup() {
    console.log("Setting up the app");
    MariaDbSetup();
}

async function MariaDbSetup()
{
    var DB = CreateConnection();
    var result = DB.execute("CREATE TABLE IF NOT EXISTS Admins (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), password VARCHAR(255), ownerManagementGuid VARCHAR(255))");

    if(result)
    {
        console.log("Table created successfully");
    }
    else
    {
        console.log("[ERROR] Table creation failed");
        return;
    }

    var admins : QueryResult = [];

    DB.execute("DELETE FROM Admins");

    result = DB.execute("INSERT INTO Admins (name, password, ownerManagementGuid) VALUES " +
        "(?, PASSWORD(?), ?)," +
        "(?, PASSWORD(?), ?)",
        [process.env.MYSQL_ADMIN1_USERNAME, process.env.MYSQL_ADMIN1_PASSWORD, uuidv4(),
         process.env.MYSQL_ADMIN2_USERNAME, process.env.MYSQL_ADMIN2_PASSWORD, uuidv4()],
    );

    if(result) {
        console.log("Admin inserted successfully");
    } else {
        console.log("[ERROR] Admin insert failed");
    }
}