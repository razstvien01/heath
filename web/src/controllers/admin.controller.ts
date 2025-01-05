import { CreateConnection } from "@/config/mariadbConfig";

class AdminController {
  private guid: string | null;
  private username: string | null;
  private password: string | null;

  constructor(formData: FormData) {
    this.guid = formData.get("guid") as string | null;
    this.username = formData.get("username") as string | null;
    this.password = formData.get("password") as string | null;
  }

  public validateFormData(): boolean {
    return (
      this.guid !== null || this.username !== null || this.password !== null
    );
  }

  public async validateAdmin(): Promise<boolean> {
    const result: any = await new Promise((resolve, reject) => {
      var DB = CreateConnection();

      DB.query(
        "SELECT * FROM Admins WHERE ownerManagementGuid = ? and name = ? and password = PASSWORD(?)",
        [this.guid, this.username, this.password],
        function (err, results) {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        }
      );
    });

    return Array.isArray(result) && result.length > 0;
  }

  public validateGuid(): boolean {
    return this.guid !== null;
  }

  public async checkGuidExists(): Promise<boolean> {
    const result: any = await new Promise((resolve, reject) => {
      const DB = CreateConnection();

      DB.query(
        "SELECT * FROM Admins WHERE ownerManagementGuid = ?",
        [this.guid],
        function (err, results) {
          if (err) {
            console.log("ERR", err);
            reject(err);
          } else {
            console.log("RESOLVED", results);
            resolve(results);
          }
        }
      );
    });

    return Array.isArray(result) && result.length > 0;
  }
}

export default AdminController;
