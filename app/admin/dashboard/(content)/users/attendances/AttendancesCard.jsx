"use client";
import { useState, useMemo } from "react";
import { capitalize } from "@/_function/globalFunction";
import { statusColorsClass } from "@/_constants/attedanceConstants";

import AttendancesApprovalPartials from "./AttendancesApprovalPartials";
import AttendancesUsersView from "./AttendancesUsersView";

export function AttendancesCard({ shifts = [] }) {
  const [selectedStatus, setSelectedStatus] = useState(null);
  const handleOpen = (status) => setSelectedStatus(status);
  const handleClose = () => setSelectedStatus(null);

  const allUsers = useMemo(() => {
    return shifts.flatMap((shift) =>
      (shift.users || []).map((u) => ({
        ...u,
        attendanceStatus: String(u?.attendanceStatus || "PRESENT").toUpperCase(),
        approval: u?.approval ? String(u.approval).toUpperCase() : "",
        _shiftId: shift.id,
        _shiftType: shift.type,
        _shiftDivision: shift.divisionName,
      }))
    );
  }, [shifts]);

  const defaultStatuses = ["ABSENT", "LATE", "PERMISSION"];

  const statusSummary = defaultStatuses.map((status) => {
    const users = allUsers.filter((u) => u.attendanceStatus === status);
    const approvalCounts = users.reduce(
      (acc, u) => {
        const a = (u.approval || "PENDING").toUpperCase();
        if (a === "ACCEPTED") acc.accepted++;
        else if (a === "REJECTED") acc.rejected++;
        else acc.pending++;
        return acc;
      },
      { accepted: 0, pending: 0, rejected: 0 }
    );

    return { status, users, approvalCounts };
  });

  return (
    <div>
      <div className="text-xs text-slate-500 flex items-center gap-2 mb-4">
        <span className="px-2 py-1 rounded-md bg-emerald-50 text-emerald-600">
          A = Accepted 
        </span>
        <span className="px-2 py-1 rounded-md bg-yellow-50 text-yellow-600">
          P = Pending 
        </span>
        <span className="px-2 py-1 rounded-md bg-rose-50 text-rose-600">
          R = Rejected 
        </span>
      </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {statusSummary.map(({ status, users, approvalCounts }) => (
        <AttendancesApprovalPartials
          key={status}
          status={status}
          users={users}
          approvalCounts={approvalCounts}
          statusColorsClass={statusColorsClass}
          onClick={() => users.length > 0 && handleOpen(status)}
        />
      ))}

      <AttendancesUsersView
        selectedStatus={selectedStatus}
        shifts={shifts}
        allUsers={allUsers}
        onClose={handleClose}
      />
    </div>
    </div>
  );
}
