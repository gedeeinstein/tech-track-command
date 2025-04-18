
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DepartmentsList } from '@/components/departments/DepartmentsList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Departments = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-2xl font-bold">Departments</CardTitle>
          <Button onClick={() => navigate('/departments/new')} className="ml-4">
            <Plus className="mr-2 h-4 w-4" />
            Add Department
          </Button>
        </CardHeader>
        <CardContent>
          <DepartmentsList />
        </CardContent>
      </Card>
    </div>
  );
};

export default Departments;
