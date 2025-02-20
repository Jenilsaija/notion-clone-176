"use client";
import { LoginForm } from "@/components/login-form"
import { useToast } from "@/hooks/use-toast";
import { setCookie } from "@/lib/cokkies.lib";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const Router = useRouter();
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  })
  const { toast } = useToast()

  function handleSubmit(e) {
    e.preventDefault();
    const objReq = {
      "action": "LOGIN",
      ...credentials
    }
    axios.post("/api/auth", objReq).then((res) => {
      if (res.data.status) {
        setCookie("userToken", btoa(res.data.data.userToken),1);
        Router.push("/")
      } else {
        toast({
          title: res.data.message,
          type: "error"
        })
      }
    })
  }

  return (
    <>
      <div
        className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <a href="#" className="flex items-center gap-2 self-center font-medium">
            <div
              className="flex h-6 w-6 items-center justify-center rounded-md ">
              <Image className="size-6" src={"/logo.png"} alt="logo" width={100} height={100} />
            </div>
            Tech <span className="text-blue-700">Link</span> Solving
          </a>
          <LoginForm
            credentials={credentials}
            setCredentials={setCredentials}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </>
  );
}
