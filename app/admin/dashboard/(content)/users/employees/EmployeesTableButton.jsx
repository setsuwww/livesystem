import React from 'react'
import { Button } from '@/_components/ui/Button';

export default function EmployeesTableButton() {
  return (
    <div className="flex items-center space-x-2">
        <Button variant="outline">Attendance</Button>
        <Button variant="primary">Add Employees</Button>
    </div>
  )
}
