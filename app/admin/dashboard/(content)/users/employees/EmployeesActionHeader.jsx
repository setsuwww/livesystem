"use client"

import React, { useState } from "react"
import { FolderInput, Trash2, Check, ChevronsUpDown } from "lucide-react"
import { Input } from "@/_components/ui/Input"
import { Button } from "@/_components/ui/Button"
import { Popover, PopoverTrigger, PopoverContent } from "@/_components/ui/Popover"
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/_components/ui/Command"
import { Badge } from "@/_components/ui/Badge"
import { cn } from "@/_lib/utils"
import { divisionStyles } from '@/_constants/divisionConstants';

export const EmployeesActionHeader = React.memo(function EmployeesActionHeader({
  search, setSearch,
  selected, onDeleteSelected, onDeleteAll, onExport,
  divisionFilter, setDivisionFilter,
  divisions = [], shifts = [],
}) {
  const [openDivision, setOpenDivision] = useState(false)
  const [openShift, setOpenShift] = useState(false)
  const [statusFilter, setStatusFilter] = useState([])

  const selectedDivision =
    divisionFilter === "all" ? "All" : divisions.find((d) => String(d.id) === divisionFilter)?.name ?? "Select Division"

  const toggleStatus = (status) => {
    setStatusFilter((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    )
  }

  return (
    <div className="flex flex-wrap justify-between items-center gap-2">
      <div className="flex items-center gap-2 w-full md:w-2/3">
        <Popover open={openDivision} onOpenChange={setOpenDivision}>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" aria-expanded={openDivision}
              className="w-fit flex items-center justify-between rounded-md hover:bg-transparent border-slate-200 shadox-sm"
            >
              <div className="flex items-center text-slate-500">
                <span className="font-semibold text-slate-600 mr-2">Division:</span>
                <span className="text-slate-400">{selectedDivision}</span>
              </div>
              <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-80">
            <Command>
              <div className="flex items-center justify-between px-2 py-2 border-b border-slate-200">
                <CommandInput placeholder="Search division..." withBorder={false} />
                <div className="flex gap-1">
                  {["WFO", "WFA"].map((type) => (
                    <Badge key={type} onClick={() => toggleStatus(type)} variant={statusFilter.includes(type) ? "secondary" : "outline"}
                      className={cn("cursor-pointer text-xs select-none text-slate-500",
                        statusFilter.includes(type) && divisionStyles[type]
                      )}
                    >
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>

              <CommandList>
                <CommandEmpty>No division found.</CommandEmpty>
                <CommandGroup>
                  <CommandItem value="all" onSelect={() => { setDivisionFilter("all")
                      setOpenDivision(false)
                    }}
                  >
                    <Check className={cn("mr-2 h-4 w-4", divisionFilter === "all" ? "opacity-100" : "opacity-0")}/>
                    All
                  </CommandItem>

                  {divisions.filter((d) => statusFilter.length === 0 || statusFilter.includes(d.type))
                    .map((d) => (
                      <CommandItem key={d.id} value={d.name} onSelect={() => { setDivisionFilter(String(d.id))
                          setOpenDivision(false)
                        }}>
                        <Check className={cn("mr-2 h-4 w-4", divisionFilter === String(d.id) ? "opacity-100" : "opacity-0")}/>
                        {d.name}
                      </CommandItem>
                    ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <Input placeholder="Search employees..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-1/3 min-w-[160px]" typeSearch={true}
        />
      </div>

      <div className="flex items-center gap-x-2">
        <Button variant="ghost" size="sm" className="text-rose-500" onClick={onDeleteSelected} disabled={!selected.length}>
          Delete Selected
        </Button>
        <Button variant="ghost" size="sm" className="bg-rose-50 text-rose-500 hover:bg-rose-100" onClick={onDeleteAll}>
          <Trash2 className="w-4 h-4 mr-1" /> Delete All
        </Button>
        <Button variant="ghost" size="sm" className="bg-teal-100/50 text-teal-600 hover:bg-teal-100" onClick={onExport}>
          <FolderInput className="w-4 h-4 mr-1" /> Export
        </Button>
      </div>
    </div>
  )
})
