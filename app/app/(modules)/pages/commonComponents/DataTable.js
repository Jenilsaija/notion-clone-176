import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import React from 'react'

const DataTable = ({
  columns,
  data = [],
}) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })
  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {data !== undefined && data?.map((row,index) => {
              return (
                <>
                  <TableRow
                    key={index}
                  >
                    {Object.keys(row).map((key) => {
                      return (
                        <TableCell key={key}>
                          {row[key]}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                </>
              )
            })
          }
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default DataTable
