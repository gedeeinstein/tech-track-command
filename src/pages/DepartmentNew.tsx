
import React from 'react';
import { DepartmentForm } from '@/components/departments/DepartmentForm';
import { createDepartment } from '@/services/departmentService';

const DepartmentNew = () => {
  return (
    <div className="container mx-auto p-6">
      <DepartmentForm
        title="Create Department"
        onSubmit={createDepartment}
      />
    </div>
  );
};

export default DepartmentNew;
