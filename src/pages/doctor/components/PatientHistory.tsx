import React from 'react';
import type { Visit } from '@/services/mocks/visitData';
import { Badge } from '@/components/ui/badge';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { Calendar, Activity, Pill, ClipboardList, Thermometer, HeartPulse, Droplets } from 'lucide-react';

interface PatientHistoryProps {
  visits: Visit[];
}

const PatientHistory: React.FC<PatientHistoryProps> = ({ visits }) => {
  if (visits.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
        No previous visits found for this patient.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <ClipboardList className="h-5 w-5 text-primary" />
        Previous Visits History
      </h3>
      <Accordion type="single" collapsible className="w-full space-y-2">
        {visits.map((visit) => (
          <AccordionItem key={visit.id} value={visit.id} className="border rounded-lg px-4 bg-card">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center justify-between w-full pr-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">{visit.visitDate}</p>
                    <p className="text-xs text-muted-foreground">{visit.medicalHistory?.disease || 'General Checkup'}</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Done
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4 pt-2 border-t">
              {visit.medicalHistory ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                  {/* Vitals Section */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold flex items-center gap-2 text-primary">
                      <Activity className="h-4 w-4" />
                      Vitals
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-muted/50 p-2 rounded-md text-center">
                        <Thermometer className="h-4 w-4 mx-auto mb-1 text-orange-500" />
                        <p className="text-[10px] text-muted-foreground uppercase">Temp</p>
                        <p className="text-sm font-bold">{visit.medicalHistory.vitals.temperature}°F</p>
                      </div>
                      <div className="bg-muted/50 p-2 rounded-md text-center">
                        <HeartPulse className="h-4 w-4 mx-auto mb-1 text-red-500" />
                        <p className="text-[10px] text-muted-foreground uppercase">Pulse</p>
                        <p className="text-sm font-bold">{visit.medicalHistory.vitals.pulse}</p>
                      </div>
                      <div className="bg-muted/50 p-2 rounded-md text-center">
                        <Droplets className="h-4 w-4 mx-auto mb-1 text-blue-500" />
                        <p className="text-[10px] text-muted-foreground uppercase">BP</p>
                        <p className="text-sm font-bold">{visit.medicalHistory.vitals.bp}</p>
                      </div>
                    </div>

                    <div className="space-y-2 mt-4">
                      <h4 className="text-sm font-semibold text-primary">Symptoms & Disease</h4>
                      <div className="space-y-1">
                        <p className="text-xs font-medium">Disease:</p>
                        <p className="text-sm bg-muted/30 p-2 rounded">{visit.medicalHistory.disease} ({visit.medicalHistory.diseaseDuration})</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-medium">Symptoms:</p>
                        <p className="text-sm bg-muted/30 p-2 rounded">{visit.medicalHistory.presentSymptoms}</p>
                      </div>
                    </div>
                  </div>

                  {/* Treatment & Advice Section */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold flex items-center gap-2 text-primary">
                        <Pill className="h-4 w-4" />
                        Medicines Given
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {visit.medicalHistory.medicinesGiven.map((med, idx) => (
                          <Badge key={idx} variant="secondary" className="font-normal">
                            {med}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-primary">Other Problems</h4>
                      <div className="flex flex-wrap gap-2">
                        {visit.medicalHistory.otherProblems.acidity && <Badge variant="outline" className="text-[10px]">Acidity</Badge>}
                        {visit.medicalHistory.otherProblems.diabetes && <Badge variant="outline" className="text-[10px]">Diabetes</Badge>}
                        {visit.medicalHistory.otherProblems.constipation && <Badge variant="outline" className="text-[10px]">Constipation</Badge>}
                        {visit.medicalHistory.otherProblems.amebiasis && <Badge variant="outline" className="text-[10px]">Amebiasis</Badge>}
                        {visit.medicalHistory.otherProblems.bp && <Badge variant="outline" className="text-[10px]">BP Issues</Badge>}
                        {visit.medicalHistory.otherProblems.other && (
                          <p className="text-xs text-muted-foreground italic w-full">Other: {visit.medicalHistory.otherProblems.other}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-primary">Doctor's Advice</h4>
                      <p className="text-sm bg-primary/5 p-2 border border-primary/10 rounded italic">
                        "{visit.medicalHistory.advice}"
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">No detailed medical records for this visit.</p>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default PatientHistory;
