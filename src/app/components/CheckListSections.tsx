// components/ChecklistSections.tsx
import React from 'react';
import { Clock, CheckCircle2 } from 'lucide-react';
import { FormData, ExpandedSections, TaskCategory, PrepItem } from '@/types';
import { TaskSection } from './TaskSection';
import { PrepSection } from './PrepSection';
import { DuringHoursReminder } from './DuringHoursReminder';
import { PrepQuantities } from '@/types';

interface ChecklistSectionsProps {
  formData: FormData;
  expandedSections: ExpandedSections;
  onToggleSection: (section: string) => void;
  onTaskChange: (
    category: TaskCategory,
    task: string,
    checked: boolean
  ) => void;
  onPrepQuantityChange: (item: PrepItem, value: number) => void;
  getTaskLabel: (key: keyof PrepQuantities) => string;
}

export const ChecklistSections = ({
  formData,
  expandedSections,
  onToggleSection,
  onTaskChange,
  onPrepQuantityChange,
  getTaskLabel,
}: ChecklistSectionsProps) => {
  if (formData.shift === 'opening') {
    return (
      <>
        <TaskSection
          title='Before Open'
          tasks={formData.openingTasks}
          category='openingTasks'
          icon={Clock}
          sectionKey='beforeOpen'
          color='bg-blue-500'
          isExpanded={expandedSections.beforeOpen}
          onToggle={onToggleSection}
          onTaskChange={onTaskChange}
          getTaskLabel={getTaskLabel}
        />

        <PrepSection
          title='Prep Completed'
          sectionKey='prep'
          color='bg-green-500'
          prepQuantities={formData.prepQuantities}
          onPrepQuantityChange={onPrepQuantityChange}
          isExpanded={expandedSections.prep}
          onToggle={onToggleSection}
          getTaskLabel={getTaskLabel}
        />

        <DuringHoursReminder />
      </>
    );
  }

  return (
    <>
      <TaskSection
        title='After Close Manager Sign-off'
        tasks={formData.closingTasks}
        category='closingTasks'
        icon={CheckCircle2}
        sectionKey='afterClose'
        color='bg-purple-500'
        isExpanded={expandedSections.afterClose}
        onToggle={onToggleSection}
        onTaskChange={onTaskChange}
        getTaskLabel={getTaskLabel}
      />

      <PrepSection
        title='Prep Completed'
        sectionKey='closingPrep'
        color='bg-green-500'
        prepQuantities={formData.prepQuantities}
        onPrepQuantityChange={onPrepQuantityChange}
        isExpanded={expandedSections.closingPrep}
        onToggle={onToggleSection}
        getTaskLabel={getTaskLabel}
      />

      <DuringHoursReminder />
    </>
  );
};
