"use client";

import { useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/Table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { Checkbox } from "@/components/ui/Checkbox";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { CircleUserRound, Repeat, Trash2, FolderInput } from "lucide-react";
import { roleStyles } from "@/constants/roleStyles";
import { capitalize } from "@/function/helpers/timeHelpers";
import { format } from "date-fns";
import { EmployeesSwitchModal } from "../../../users/employees/EmployeesSwitchModal";

export default function UserShiftTable({ data }) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("ALL");
  const [modalOpen, setModalOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredData.map((u) => u.id));
    }
  };

  const filteredData = useMemo(() => {
    return data.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());

      const matchesRole = filterRole === "ALL" ? true : u.role === filterRole;

      return matchesSearch && matchesRole;
    });
  }, [data, search, filterRole]);

  const handleDeleteSelected = () => {
    console.log("Delete selected:", selectedIds);
    setSelectedIds([]);
  };

  const handleDeleteAll = () => console.log("Delete all");

  const handleSwapShift = (userId) => {
    setCurrentUserId(userId);
    setModalOpen(true);
  };

  const handleEditUser = (userId) => console.log("Edit user:", userId);

  const handleDeleteUser = (userId) => console.log("Delete user:", userId);

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-2">
          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger>
              <span className="text-zinc-700 font-semibold">Role :</span>
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="COORDINATOR">Manager</SelectItem>
              <SelectItem value="EMPLOYEE">Staff</SelectItem>
              <SelectItem value="USER">User</SelectItem>
            </SelectContent>
          </Select>

          <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <Button size="sm" variant="destructive" disabled={selectedIds.length === 0} onClick={handleDeleteSelected}>
            Delete Selected <span className="bg-white text-xs font-semibold px-1 rounded-md text-red-500">{selectedIds.length}</span>
          </Button>
          <Button size="sm" variant="destructive" onClick={handleDeleteAll}>
            <Trash2 size={18} strokeWidth={2} />
            Delete All
          </Button>
          <Button size="sm" variant="secondary" onClick={() => console.log("Export CSV")} className="bg-green-600 hover:bg-green-500 border-green-600 hover:border-green-600 text-white">
            <FolderInput size={16} /> Export
          </Button>
        </div>
      </div>


      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Checkbox
                checked={
                  selectedIds.length > 0 &&
                  selectedIds.length === filteredData.length
                }
                onCheckedChange={toggleSelectAll}
              />
            </TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Created & Updated</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredData.map((user) => {
            const created = format(new Date(user.createdAt), "dd-MM-yyyy");
            const updated = format(new Date(user.updatedAt), "dd-MM-yyyy");

            return (
              <TableRow key={user.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(user.id)}
                    onCheckedChange={() => {
                      if (selectedIds.includes(user.id)) {
                        setSelectedIds(selectedIds.filter((id) => id !== user.id));
                      } else {
                        setSelectedIds([...selectedIds, user.id]);
                      }
                    }}
                  />
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-x-2">
                    <div className="p-2 bg-zinc-200 rounded-full">
                      <CircleUserRound strokeWidth={1.5} className="text-zinc-500" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold">{user.name}</span>
                      <span className="text-xs text-zinc-500">{user.email}</span>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <span className={`px-2 py-0.5 text-xs font-semibold border rounded-md ${roleStyles[capitalize(user.role)] ?? ""}`}>
                    {capitalize(user.role)}
                  </span>
                </TableCell>

                <TableCell>
                  <span className="flex flex-col text-xs space-y-1">
                    <span className="text-sm font-base text-zinc-600">
                      {created}
                    </span>
                    <span className="text-xs text-gray-400">
                      {updated}
                    </span>
                  </span>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleSwapShift(user.id)}>
                      <Repeat />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleEditUser(user.id)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDeleteUser(user.id)}>
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Swap Shift Modal */}
      <EmployeesSwitchModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        currentUserId={currentUserId}
      />
    </div>
  );
}
