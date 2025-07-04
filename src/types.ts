import { LucideIcon } from 'lucide-react';

export interface PrepQuantities {
  meat: number;
  sauceBatches: number;
  sauceCups: number;
  onions: number;
  tomato: number;
  lettuce: number;
  yellowChiles: number;
  pickles: number;
  // ✅ Add index signature to allow dynamic access
  [key: string]: number;
}

export interface OpeningTasks {
  brushOutside: boolean;
  setupCleanTables: boolean;
  pourHotWaterSoda: boolean;
  setupSodaMachine: boolean;
  refillPaperTowels: boolean;
  setupCondiments: boolean;
  setupTrashcans: boolean;
  checkRestrooms: boolean;
  temperatureACCheck: boolean;
  // ✅ Add index signature to allow dynamic access
  [key: string]: boolean;
}

export interface ClosingTasks {
  shareNumbers: boolean;
  hotWaterSoda: boolean;
  removeSoakNozzles: boolean;
  storeFood: boolean;
  enoughPrep: boolean;
  turnOffAC: boolean;
  allEquipmentOff: boolean;
  filterFryer: boolean;
  dumpOilSunday: boolean;
  lockAllDoors: boolean;
  // ✅ Add index signature to allow dynamic access
  [key: string]: boolean;
}

export type ShiftType = 'opening' | 'closing';

export interface FormData {
  date: string;
  managerName: string;
  shift: ShiftType;
  startingTil: number; // ✅ Changed from string to number
  endingTil: number; // ✅ Changed from string to number
  notes: string;
  issues: string;
  openingTasks: OpeningTasks;
  closingTasks: ClosingTasks;
  prepQuantities: PrepQuantities;
}

export interface SavedChecklist extends FormData {
  id: number;
  savedAt: string;
}

export interface ExpandedSections {
  [key: string]: boolean;
}

export type TaskCategory = 'openingTasks' | 'closingTasks';
export type ShiftOption = 'opening' | 'closing';
export type PrepItem = keyof PrepQuantities;
export type OpeningTaskKey = keyof OpeningTasks;
export type ClosingTaskKey = keyof ClosingTasks;

// COMPONENT PROPS INTERFACES

export interface ChecklistHeaderProps {
  overallProgress: number;
  showSetupWarning?: boolean;
  title?: string;
}

export interface BasicInfoFormProps {
  formData: FormData;
  onInputChange: (field: keyof FormData, value: string) => void;
  showTilFields?: boolean;
  shiftOptions?: ShiftOption[];
}

export interface TaskSectionProps {
  title: string;
  tasks: Record<string, boolean> | OpeningTasks | ClosingTasks;
  category: TaskCategory;
  icon: LucideIcon;
  sectionKey: string;
  color: string;
  isExpanded: boolean;
  onToggle: (sectionKey: string) => void;
  onTaskChange: (
    category: TaskCategory,
    task: string,
    checked: boolean
  ) => void;
  getTaskLabel: (key: string) => string;
}

export interface PrepSectionProps {
  title: string;
  sectionKey: string;
  color: string;
  prepQuantities: PrepQuantities;
  onPrepQuantityChange: (key: keyof PrepQuantities, value: number) => void;
  isExpanded: boolean;
  onToggle: (key: string) => void;
  getTaskLabel: (key: keyof PrepQuantities) => string;
  prepItems?: Array<keyof PrepQuantities>;
}

export interface DuringHoursReminderProps {
  tasks?: string[];
}

export interface NotesSectionProps {
  notes: string;
  issues: string;
  onNotesChange: (value: string) => void;
  onIssuesChange: (value: string) => void;
  isExpanded: boolean;
  onToggle: (sectionKey: string) => void;
  sectionKey?: string;
}

export interface RecentSavesProps {
  savedChecklists: SavedChecklist[];
}

export interface BottomActionBarProps {
  onSave: () => void;
  onDownload: () => void;
  isLoading?: boolean;
  saveText?: string;
}
