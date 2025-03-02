"use client";
import React from 'react'
import DataTable from './commonComponents/DataTable';
import { columns } from './commonComponents/TableColumn';

const page = () => {
  const data= [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    // ...
  ]
  return (
    <div>
      <DataTable  columns={columns} data={data}/>
    </div>
  )
}

export default page
