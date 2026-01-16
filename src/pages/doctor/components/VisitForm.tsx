import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MultiSelect } from '@/components/ui/multi-select';
import { 
  Search, 
  Plus, 
  X, 
  Stethoscope, 
  Activity, 
  AlertCircle, 
  Pill, 
  Calendar, 
  Save,
  Loader2,
  Syringe
} from 'lucide-react';
import { mockMedicines } from '@/services/mocks/medicineData';
import { updateVisit, getMetadata, type Metadata } from '@/services/api';
import toast from 'react-hot-toast';

const visitSchema = z.object({
  disease: z.array(z.string()).min(1, 'At least one disease is required'),
  diseaseOther: z.string().optional(),
  diseaseDuration: z.string().optional(),
  presentSymptoms: z.array(z.string()).optional(),
  presentSymptomsOther: z.string().optional(),
  previousTreatment: z.array(z.string()).optional(),
  previousTreatmentOther: z.string().optional(),
  treatmentGiven: z.array(z.string()).optional(),
  treatmentGivenOther: z.string().optional(),
  vitals: z.object({
    pulse: z.number().min(0).optional(),
    bp: z.string().optional(),
    temperature: z.number().min(0).optional(),
  }),
  otherProblems: z.object({
    acidity: z.boolean().default(false),
    diabetes: z.boolean().default(false),
    constipation: z.boolean().default(false),
    amebiasis: z.boolean().default(false),
    bp: z.boolean().default(false),
    heartProblems: z.boolean().default(false),
    other: z.string().optional(),
  }),
  medicinesGiven: z.array(z.string()).optional(),
  advice: z.string().optional(),
  followUpDate: z.string().optional(),
});

type VisitFormValues = z.infer<typeof visitSchema>;

// ... types ...
interface VisitFormProps {
  visitId: string;
  onSuccess: () => void;
  metadata: Metadata | null;
}

const VisitForm: React.FC<VisitFormProps> = ({ visitId, onSuccess, metadata }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [medicineSearch, setMedicineSearch] = useState('');
  
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<VisitFormValues>({
    resolver: zodResolver(visitSchema),
    defaultValues: {
      disease: [],
      presentSymptoms: [],
      previousTreatment: [],
      treatmentGiven: [],
      vitals: { pulse: undefined, bp: '', temperature: undefined },
      otherProblems: { 
        acidity: false, 
        diabetes: false, 
        constipation: false, 
        amebiasis: false, 
        bp: false, 
        heartProblems: false,
        other: '' 
      },
      medicinesGiven: [],
    },
  });

  // Removed internal useEffect fetch. Using prop `metadata`.

  const selectedMedicines = watch('medicinesGiven') || [];
  // ...

  const filteredMedicines = (metadata?.medicines || mockMedicines).filter(m => 
    m.toLowerCase().includes(medicineSearch.toLowerCase()) && 
    !selectedMedicines.includes(m)
  );

  const addMedicine = (medicine: string) => {
    setValue('medicinesGiven', [...selectedMedicines, medicine]);
    setMedicineSearch('');
  };

  const removeMedicine = (medicine: string) => {
    setValue('medicinesGiven', selectedMedicines.filter(m => m !== medicine));
  };

  const onSubmit = async (data: VisitFormValues) => {
    setIsSubmitting(true);
    try {
      // Merge "Other" values into arrays if they exist
      const finalData = {
        ...data,
        disease: data.diseaseOther ? [...data.disease, data.diseaseOther] : data.disease,
        presentSymptoms: data.presentSymptomsOther ? [...(data.presentSymptoms || []), data.presentSymptomsOther] : data.presentSymptoms,
        previousTreatment: data.previousTreatmentOther ? [...(data.previousTreatment || []), data.previousTreatmentOther] : data.previousTreatment,
        treatmentGiven: data.treatmentGivenOther ? [...(data.treatmentGiven || []), data.treatmentGivenOther] : data.treatmentGiven,
      };

      await updateVisit(visitId, finalData);
      toast.success('Visit details updated successfully');
      onSuccess();
    } catch (error) {
      toast.error('Failed to update visit details');
    } finally {
      setIsSubmitting(false);
    }
  };

  const watchDisease = watch('disease') || [];
  const watchSymptoms = watch('presentSymptoms') || [];
  const watchPrevTreatment = watch('previousTreatment') || [];
  const watchTreatmentGiven = watch('treatmentGiven') || [];

  return (
    <Card className="border-primary/20">
      <CardHeader className="bg-primary/5">
        <CardTitle className="text-lg flex items-center gap-2">
          <Stethoscope className="h-5 w-5 text-primary" />
          Visit Examination
        </CardTitle>
        <CardDescription>Record clinical findings and prescribe medicines</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Diagnosis */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Main Disease/Condition <span className="text-destructive">*</span></Label>
                <Controller
                  name="disease"
                  control={control}
                  render={({ field }) => (
                    <MultiSelect
                      options={metadata?.diseases || []}
                      selected={field.value}
                      onChange={field.onChange}
                      placeholder="Select Diseases"
                    />
                  )}
                />
                <Input 
                  {...register('diseaseOther')} 
                  placeholder="Other Disease (if any)" 
                  className="mt-2"
                />
                {errors.disease && <p className="text-xs text-destructive">{errors.disease.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="diseaseDuration">Duration</Label>
                <Input id="diseaseDuration" {...register('diseaseDuration')} placeholder="e.g., 3 days, 2 months" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Presenting Symptoms</Label>
                <Controller
                  name="presentSymptoms"
                  control={control}
                  render={({ field }) => (
                    <MultiSelect
                      options={metadata?.symptoms || []}
                      selected={field.value || []}
                      onChange={field.onChange}
                      placeholder="Select Symptoms"
                    />
                  )}
                />
                <Input 
                  {...register('presentSymptomsOther')} 
                  placeholder="Other Symptoms (if any)" 
                  className="mt-2"
                />
              </div>
              <div className="space-y-2">
                <Label>Previous Treatment</Label>
                <Controller
                  name="previousTreatment"
                  control={control}
                  render={({ field }) => (
                    <MultiSelect
                      options={metadata?.treatments || []}
                      selected={field.value || []}
                      onChange={field.onChange}
                      placeholder="Select Previous Treatments"
                    />
                  )}
                />
                <Input 
                  {...register('previousTreatmentOther')} 
                  placeholder="Other Previous Treatment (if any)" 
                  className="mt-2"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Treatment Given Today</Label>
              <Controller
                name="treatmentGiven"
                control={control}
                render={({ field }) => (
                  <MultiSelect
                    options={metadata?.treatments || []}
                    selected={field.value || []}
                    onChange={field.onChange}
                    placeholder="Select Treatments Given"
                  />
                )}
              />
              <Input 
                {...register('treatmentGivenOther')} 
                placeholder="Other Treatment Given (if any, e.g. Basti)" 
                className="mt-2"
              />
            </div>
          </div>

          <Separator />

          {/* Vitals */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              Patient Vitals
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vitals.pulse">Pulse (bpm)</Label>
                <Input 
                  id="vitals.pulse" 
                  type="number" 
                  {...register('vitals.pulse', { valueAsNumber: true })} 
                  placeholder="e.g. 72"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vitals.bp">Blood Pressure (mmHg)</Label>
                <Input id="vitals.bp" {...register('vitals.bp')} placeholder="120/80" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vitals.temperature">Temperature (°F)</Label>
                <Input 
                  id="vitals.temperature" 
                  type="number" 
                  step="0.1" 
                  {...register('vitals.temperature', { valueAsNumber: true })} 
                  placeholder="98.6"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Other Problems */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-primary" />
              Co-morbidities / Other Problems
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {[
                { id: 'acidity', label: 'Acidity' },
                { id: 'constipation', label: 'Constipation' },
                { id: 'amebiasis', label: 'Amebiasis' },
                { id: 'bp', label: 'BP' },
                { id: 'diabetes', label: 'Diabetes' },
                { id: 'heartProblems', label: 'Heart Problems' },
              ].map((problem) => (
                <div key={problem.id} className="flex items-center space-x-2 min-h-[24px]">
                  <input
                    type="checkbox"
                    id={`problem-${problem.id}`}
                    {...register(`otherProblems.${problem.id}` as any)}
                    className="h-5 w-5 shrink-0 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer transition-all"
                  />
                  <Label htmlFor={`problem-${problem.id}`} className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {problem.label}
                  </Label>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <Label htmlFor="otherProblems.other">Other Health Issues</Label>
              <Input id="otherProblems.other" {...register('otherProblems.other')} placeholder="Any other health issues..." />
            </div>
          </div>

          <Separator />

          {/* Medicines */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Pill className="h-4 w-4 text-primary" />
              Prescribed Medicines
            </h3>
            
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search and add medicines (e.g. Mahasudarshan Vati)..."
                  value={medicineSearch}
                  onChange={(e) => setMedicineSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              {medicineSearch && (
                <Card className="absolute z-10 w-full mt-1 shadow-lg border-primary/10">
                  <ScrollArea className="h-48">
                    <div className="p-2 space-y-1">
                      {filteredMedicines.length > 0 ? (
                        filteredMedicines.map((med) => (
                          <button
                            key={med}
                            type="button"
                            onClick={() => addMedicine(med)}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-primary/5 rounded-md flex items-center justify-between group"
                          >
                            {med}
                            <Plus className="h-3 w-3 opacity-0 group-hover:opacity-100" />
                          </button>
                        ))
                      ) : (
                        <p className="text-xs text-center py-4 text-muted-foreground">No medicines found</p>
                      )}
                    </div>
                  </ScrollArea>
                </Card>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {selectedMedicines.map((med) => (
                <Badge key={med} variant="secondary" className="pl-3 pr-1 py-1 flex items-center gap-2">
                  {med}
                  <button
                    type="button"
                    onClick={() => removeMedicine(med)}
                    className="hover:bg-destructive/10 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {selectedMedicines.length === 0 && (
                <p className="text-sm text-muted-foreground italic">No medicines prescribed yet</p>
              )}
            </div>
          </div>

          <Separator />

          {/* Advice & Follow-up */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="advice">Doctor's Advice</Label>
              <textarea
                id="advice"
                {...register('advice')}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="e.g., Take with lukewarm water, avoid spicy food..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="followUpDate">Follow-up Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="followUpDate" 
                  type="date" 
                  {...register('followUpDate')} 
                  className="pl-9"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Submit Visit Details
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default VisitForm;
