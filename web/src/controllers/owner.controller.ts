import { CreateConnection } from "@/config/mariadbConfig";
import { v4 as uuidv4 } from "uuid";

class OwnerController {
  private username: string | null;
  private password: string | null;

  constructor(formData: FormData) {
    this.username = formData.get("username") as string | null;
    this.password = formData.get("password") as string | null;
  }

  public validateFormData(): boolean {
    return this.username !== null || this.password !== null;
  }

  public async addOwner(): Promise<boolean> {
    var DB = CreateConnection();
    const result = DB.execute(
      "INSERT INTO Owners (name, password, managementGuid) VALUES " +
        "(?, PASSWORD(?), ?)",
      [this.username, this.password, uuidv4()]
    );

    return result != null;
  }

  public async getOwners(): Promise<any> {
    const result: any = await new Promise((resolve, reject) => {
      var DB = CreateConnection();

      DB.query("SELECT * FROM Owners", function (err, results) {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
    
    return result;
  }
}

export default OwnerController;
