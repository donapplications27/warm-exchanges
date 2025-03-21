
import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

interface TechnicianModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
  technician1: z.string().optional(),
  technician2: z.string().optional(),
  technician3: z.string().optional(),
});

type TechnicianFormValues = z.infer<typeof formSchema>;

export function TechnicianModal({ open, onOpenChange }: TechnicianModalProps) {
  // Load technician coordinates from localStorage
  const loadTechnicianData = (): TechnicianFormValues => {
    if (typeof window === "undefined") {
      return {
        technician1: '',
        technician2: '',
        technician3: '',
      };
    }
    
    try {
      const savedData = localStorage.getItem('technician-coordinates');
      if (savedData) {
        return JSON.parse(savedData);
      }
    } catch (error) {
      console.error("Failed to load technician data:", error);
    }
    
    return {
      technician1: '',
      technician2: '',
      technician3: '',
    };
  };

  const form = useForm<TechnicianFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: loadTechnicianData(),
  });

  const onSubmit = (data: TechnicianFormValues) => {
    try {
      localStorage.setItem('technician-coordinates', JSON.stringify(data));
      toast.success("Technician coordinates saved successfully");
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to save technician coordinates");
      console.error(error);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:max-w-[540px] bg-background border-border">
        <SheetHeader>
          <SheetTitle className="text-foreground">Technician Coordinates</SheetTitle>
        </SheetHeader>
        
        <div className="mt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="technician1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Technician 1</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Paste coordinates here (e.g., 51.5074, -0.1278)" 
                        {...field} 
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormDescription>
                      Location coordinates for Technician 1
                    </FormDescription>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="technician2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Technician 2</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Paste coordinates here (e.g., 51.5074, -0.1278)" 
                        {...field} 
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormDescription>
                      Location coordinates for Technician 2
                    </FormDescription>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="technician3"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Technician 3</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Paste coordinates here (e.g., 51.5074, -0.1278)" 
                        {...field} 
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormDescription>
                      Location coordinates for Technician 3
                    </FormDescription>
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end space-x-4 pt-4">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Save Coordinates</Button>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
