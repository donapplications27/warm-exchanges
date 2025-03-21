
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface MapModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MapModal({ open, onOpenChange }: MapModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] bg-chat-dark border-chat-border">
        <DialogHeader>
          <DialogTitle className="text-white">Location Map</DialogTitle>
        </DialogHeader>
        <div className="h-[500px] w-full flex items-center justify-center bg-chat-dark/50 rounded-md border border-gray-700">
          <p className="text-gray-400">Map will be implemented here. Connect to a map provider API.</p>
          {/* 
            To implement a real map:
            1. Add a map library like mapbox-gl or leaflet
            2. Create a map component with proper API keys
            3. Replace this placeholder with the actual map component
          */}
        </div>
      </DialogContent>
    </Dialog>
  );
}
