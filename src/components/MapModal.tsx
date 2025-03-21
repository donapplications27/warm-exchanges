import React, { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';

interface MapModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

declare global {
  interface Window {
    initMap: () => void;
  }
}

export function MapModal({ open, onOpenChange }: MapModalProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const loadSettings = () => {
      try {
        const savedSettings = localStorage.getItem('app-settings');
        if (savedSettings) {
          return JSON.parse(savedSettings);
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
        setError("Failed to load map settings");
      }
      return { mapApiKey: '' };
    };

    const loadTechnicianData = () => {
      try {
        const savedData = localStorage.getItem('technician-coordinates');
        if (savedData) {
          return JSON.parse(savedData);
        }
      } catch (error) {
        console.error("Failed to load technician data:", error);
      }
      return { technician1: '', technician2: '', technician3: '' };
    };

    const settings = loadSettings();
    const apiKey = settings.mapApiKey;

    if (!apiKey) {
      setError("Please add a Map API Key in settings");
      setIsLoading(false);
      return;
    }

    window.initMap = () => {
      if (!mapRef.current) return;

      const kloof = { lat: -29.7894, lng: 30.8419 };

      const map = new google.maps.Map(mapRef.current, {
        zoom: 12,
        center: kloof,
      });

      const iconUrl = "https://cdn-icons-png.flaticon.com/512/3671/3671229.png";

      const technicianData = loadTechnicianData();
      const technicianCoordinates = [
        technicianData.technician1,
        technicianData.technician2,
        technicianData.technician3
      ].filter(Boolean);

      technicianCoordinates.forEach((coordStr, index) => {
        try {
          const [lat, lng] = coordStr.split(',').map(coord => parseFloat(coord.trim()));
          
          if (!isNaN(lat) && !isNaN(lng)) {
            new google.maps.Marker({
              position: { lat, lng },
              map: map,
              icon: {
                url: iconUrl,
                scaledSize: new google.maps.Size(30, 30),
              },
              title: `Technician ${index + 1}`,
            });
          }
        } catch (error) {
          console.error(`Invalid coordinates for Technician ${index + 1}:`, error);
        }
      });

      new google.maps.Marker({
        position: kloof,
        map: map,
        title: "Kloof (Center)",
      });

      setIsLoading(false);
    };

    if (!scriptRef.current) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
      script.async = true;
      script.defer = true;
      script.onerror = () => {
        setError("Failed to load Google Maps. Check your API key.");
        setIsLoading(false);
      };
      document.head.appendChild(script);
      scriptRef.current = script;
    } else {
      window.initMap();
    }

    return () => {
      if (scriptRef.current && !open) {
        // We'll keep the script but clean up other resources if we close the modal
      }
    };
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Location Map</DialogTitle>
        </DialogHeader>
        
        <div className="h-[500px] w-full rounded-md border border-border overflow-hidden relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-secondary/30">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-secondary/30 p-4">
              <p className="text-destructive text-center">{error}</p>
            </div>
          )}
          
          <div id="map" ref={mapRef} className="h-full w-full" />
        </div>
      </DialogContent>
    </Dialog>
  );
}
