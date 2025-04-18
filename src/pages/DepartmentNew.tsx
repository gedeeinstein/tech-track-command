
import React from 'react';
import { DepartmentForm } from '@/components/departments/DepartmentForm';
import { createDepartment, type Department } from '@/services/departmentService';

const DepartmentNew = () => {
  // Wrapping the createDepartment function to match the expected Promise<void> return type
  const handleSubmit = async (data: Omit<Department, "id">) => {
    await createDepartment(data);
    // The function doesn't need to return anything as the DepartmentForm expects Promise<void>
  };

  return (
    <div className="container mx-auto p-6">
      <DepartmentForm
        title="Create Department"
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default DepartmentNew;
