
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Edit, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { fetchDepartments, deleteDepartment } from '@/services/departmentService';
import { toast } from '@/components/ui/use-toast';

export const DepartmentsList = () => {
  const navigate = useNavigate();
  const { data: departments, isLoading, refetch } = useQuery({
    queryKey: ['departments'],
    queryFn: fetchDepartments
  });

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      const success = await deleteDepartment(id);
      if (success) {
        refetch();
      }
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Code</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {departments?.map((department) => (
          <TableRow key={department.id}>
            <TableCell>{department.code}</TableCell>
            <TableCell>{department.name}</TableCell>
            <TableCell>{department.description}</TableCell>
            <TableCell className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/departments/edit/${department.id}`)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(department.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
