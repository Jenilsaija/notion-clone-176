"use client";
import { RegisterForm } from "@/components/register-form";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const Router = useRouter();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    cnfpassword: ""
  })
  const { toast } = useToast()

  function handleSubmit(e) {
    e.preventDefault();
    if (credentials.password !== credentials.cnfpassword) {
      return toast({
        title: "Password Mismatch",
        message: "Password and Confirm Password does not match",
        type: "error"
      })
    }
    const objreq = {
      "action": "MAKE",
      ...credentials
    }
    axios.post("/api/auth", objreq).then((res) => {
      if (res.data.status) {
        setCookie("userToken", btoa(res.data.userToken),1);
        toast({
          title: res.data.message,
          // message: "You have been successfully registered",
          type: "success"
        })
        Router.push("/login")
      } else {
        toast({
          title: res.data.message,
          // message: ,
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
          <RegisterForm
            credentials={credentials}
            setCredentials={setCredentials}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </>
  );
}
