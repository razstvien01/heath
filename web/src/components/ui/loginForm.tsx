import { useState } from "react";

interface LoginFormProps {
  guid: string;
  role: "admin" | "owner";
  onLoginSuccess: () => void;
  onLoginRequest: (
    guid: string,
    username: string,
    password: string
  ) => Promise<boolean>;
}

export function LoginForm({
  guid,
  role,
  onLoginRequest,
  onLoginSuccess,
}: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [invalidLoginState, setInvalidLoginState] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const confirmLogin = async () => {
    if (!username || !password) return;

    setIsLoading(true);
    setInvalidLoginState(false);

    try {
      const res = await onLoginRequest(guid, username, password);

      if (res) {
        setUsername("");
        setPassword("");
        onLoginSuccess();
      } else {
        setInvalidLoginState(true);
      }
    } catch (error) {
      setInvalidLoginState(true);
      console.error(`Error confirming ${role} login:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  return <></>;
}
