
import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useTheme } from '@/hooks/use-theme';

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
  supabaseUrl: z.string().url({ message: "Please enter a valid URL" }),
  supabaseKey: z.string().min(20, { message: "API key is too short" }),
  mapApiKey: z.string().optional(),
  theme: z.enum(["dark", "light", "system"], {
    required_error: "Please select a theme",
  }),
});

type SettingsFormValues = z.infer<typeof formSchema>;

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const { setTheme } = useTheme();
  
  // Get settings from localStorage
  const loadSettings = (): SettingsFormValues => {
    if (typeof window === "undefined") {
      return {
        supabaseUrl: 'https://vglszhhommhffiqaxyfz.supabase.co',
        supabaseKey: '',
        mapApiKey: '',
        theme: 'dark',
      };
    }
    
    try {
      const savedSettings = localStorage.getItem('app-settings');
      if (savedSettings) {
        return JSON.parse(savedSettings);
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    }
    
    return {
      supabaseUrl: 'https://vglszhhommhffiqaxyfz.supabase.co',
      supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnbHN6aGhvbW1oZmZpcWF4eWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzMjQwNDEsImV4cCI6MjA1NzkwMDA0MX0.Bsz7peQbQvaDLxwqtTv5r43O8IisOpeJl0jYCqxBDnw',
      mapApiKey: '',
      theme: 'dark',
    };
  };

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: loadSettings(),
  });

  const onSubmit = (data: SettingsFormValues) => {
    try {
      localStorage.setItem('app-settings', JSON.stringify(data));
      setTheme(data.theme);
      toast.success("Settings saved successfully");
      onOpenChange(false);
      
      // Note: In a real app, you would need to refresh or reload certain components
      // to apply these settings. For example, reinitialize the Supabase client.
      
    } catch (error) {
      toast.error("Failed to save settings");
      console.error(error);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:max-w-[540px] bg-background border-border">
        <SheetHeader>
          <SheetTitle className="text-foreground">Application Settings</SheetTitle>
        </SheetHeader>
        
        <div className="mt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="supabaseUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Supabase URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.supabase.co" {...field} />
                    </FormControl>
                    <FormDescription>
                      Your Supabase project URL
                    </FormDescription>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="supabaseKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Supabase API Key</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Your Supabase anon/public key" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      The public (anon) key from your Supabase project
                    </FormDescription>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="mapApiKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Map API Key</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Your map provider API key" 
                        {...field} 
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormDescription>
                      Optional: For displaying maps in the application
                    </FormDescription>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="theme"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Theme</FormLabel>
                    <div className="flex space-x-4">
                      <Button 
                        type="button"
                        variant={field.value === 'dark' ? 'default' : 'outline'}
                        onClick={() => form.setValue('theme', 'dark')}
                        className="flex-1"
                      >
                        Dark
                      </Button>
                      <Button 
                        type="button"
                        variant={field.value === 'light' ? 'default' : 'outline'}
                        onClick={() => form.setValue('theme', 'light')}
                        className="flex-1"
                      >
                        Light
                      </Button>
                      <Button 
                        type="button"
                        variant={field.value === 'system' ? 'default' : 'outline'}
                        onClick={() => form.setValue('theme', 'system')}
                        className="flex-1"
                      >
                        System
                      </Button>
                    </div>
                    <FormDescription>
                      Choose your preferred theme
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
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
