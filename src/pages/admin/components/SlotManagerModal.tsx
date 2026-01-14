import React, { useState, useEffect } from 'react';
import { Trash2, Calendar } from 'lucide-react';
import { type Hospital } from '../../../services/mocks/hospitalData';
import { type Slot } from '../../../services/mocks/slotData';
import { getSlots, deleteSlot, deleteSlotsByDate } from '../../../services/api';
import SlotCreationForm from './SlotCreationForm';
import { format, parseISO } from 'date-fns';
import toast from 'react-hot-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface SlotManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  hospital: Hospital | null;
}

const SlotManagerModal: React.FC<SlotManagerModalProps> = ({ isOpen, onClose, hospital }) => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSlots = async () => {
    if (!hospital) return;
    setLoading(true);
    try {
      const data = await getSlots(hospital.id);
      // Sort slots by start time
      const sortedSlots = data.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
      setSlots(sortedSlots);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load slots');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && hospital) {
      fetchSlots();
    }
  }, [isOpen, hospital]);

  const handleDeleteSlot = async (slotId: string) => {
    try {
      await deleteSlot(slotId);
      toast.success('Slot deleted successfully');
      fetchSlots(); // Refresh list
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete slot');
    }
  };

  const handleBulkDelete = async (date: string) => {
    if (!hospital) return;
    if (!confirm(`Are you sure you want to delete all slots for ${format(parseISO(date), 'MMMM d, yyyy')}?`)) return;
    
    try {
      await deleteSlotsByDate(hospital.id, date);
      toast.success('Slots deleted successfully');
      fetchSlots();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete slots');
    }
  };

  // Group slots by date for better display
  const groupedSlots = slots.reduce((acc, slot) => {
    const date = format(parseISO(slot.startTime), 'yyyy-MM-dd');
    if (!acc[date]) acc[date] = [];
    acc[date].push(slot);
    return acc;
  }, {} as Record<string, Slot[]>);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>Manage Slots</DialogTitle>
          <DialogDescription>
            Manage appointment slots for <span className="font-medium text-foreground">{hospital?.name}</span>
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-1 p-6 pt-2">
          {hospital && <SlotCreationForm hospitalId={hospital.id} onSuccess={fetchSlots} />}

          <Separator className="my-6" />

          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Existing Slots
            </h3>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading slots...</div>
            ) : slots.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed rounded-lg text-muted-foreground">
                No slots found. Generate some above.
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(groupedSlots).map(([date, daySlots]) => (
                  <div key={date} className="rounded-lg border bg-card text-card-foreground shadow-sm">
                    <div className="p-4 bg-muted/30 border-b font-medium flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        {format(parseISO(date), 'EEEE, MMMM d, yyyy')}
                        <Badge variant="secondary" className="ml-2">
                          {daySlots.length} slots
                        </Badge>
                      </div>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        className="h-8 gap-2"
                        onClick={() => handleBulkDelete(date)}
                      >
                        <Trash2 size={14} />
                        Delete Day
                      </Button>
                    </div>
                    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {daySlots.map((slot) => (
                        <div key={slot.id} className="flex items-center justify-between p-3 rounded-md border bg-background hover:bg-accent/50 transition-colors group">
                          <div>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs">#{slot.slotNumber}</Badge>
                              <span className="font-medium text-sm">
                                {format(parseISO(slot.startTime), 'h:mm a')} - {format(parseISO(slot.endTime), 'h:mm a')}
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              Capacity: {slot.bookedCount}/{slot.maxCapacity}
                            </div>
                            <div className="w-full h-1.5 bg-secondary rounded-full mt-2 overflow-hidden">
                              <div 
                                className="h-full bg-green-500 transition-all duration-300 ease-in-out rounded-full"
                                style={{ width: `${(slot.bookedCount / slot.maxCapacity) * 100}%` }}
                              />
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteSlot(slot.id)}
                            disabled={slot.bookedCount > 0}
                            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            title={slot.bookedCount > 0 ? 'Cannot delete booked slot' : 'Delete slot'}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default SlotManagerModal;
