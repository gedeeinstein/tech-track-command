
import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Department } from '@/services/departmentService';

interface DepartmentFormProps {
  initialData?: Department;
  onSubmit: (data: Omit<Department, 'id'>) => Promise<void>;
  title: string;
}

export const DepartmentForm = ({ initialData, onSubmit, title }: DepartmentFormProps) => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialData || {
      code: '',
      name: '',
      description: ''
    }
  });

  const onSubmitForm = async (data: Omit<Department, 'id'>) => {
    try {
      await onSubmit(data);
      navigate('/departments');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save department",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
          <div>
            <Label htmlFor="code">Code</Label>
            <Input
              id="code"
              {...register('code', { required: 'Code is required' })}
            />
            {errors.code && (
              <p className="text-sm text-red-500">{errors.code.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              {...register('name', { required: 'Name is required' })}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              {...register('description')}
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit">Save</Button>
            <Button type="button" variant="outline" onClick={() => navigate('/departments')}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
