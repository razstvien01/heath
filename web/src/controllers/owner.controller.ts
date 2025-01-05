import { CreateConnection } from "@/config/mariadbConfig";

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
}

export default OwnerController;
