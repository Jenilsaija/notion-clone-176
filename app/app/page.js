"use client";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react'

const page = (params) => {
  const Router=useRouter();
  useEffect(()=>{
    Router.push("/app/dashboard");
  },[])
}

export default page
