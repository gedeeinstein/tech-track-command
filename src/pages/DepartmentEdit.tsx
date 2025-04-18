
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { DepartmentForm } from '@/components/departments/DepartmentForm';
import { fetchDepartments, updateDepartment } from '@/services/departmentService';
import type { Department } from '@/services/departmentService';

const DepartmentEdit = () => {
  const { id } = useParams<{ id: string }>();
  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: fetchDepartments
  });

  const department = departments?.find(d => d.id === id);

  if (!department) {
    return <div>Loading...</div>;
  }

  const handleSubmit = async (data: Omit<Department, 'id'>) => {
    if (id) {
      await updateDepartment(id, data);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <DepartmentForm
        title="Edit Department"
        initialData={department}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default DepartmentEdit;
