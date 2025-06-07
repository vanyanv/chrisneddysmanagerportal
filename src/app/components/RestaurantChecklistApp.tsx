'use client';
import React, { useState } from 'react';
import { Clock, CheckCircle2 } from 'lucide-react';
import {
  FormData,
  ExpandedSections,
  SavedChecklist,
  TaskCategory,
  PrepItem,
} from '@/types';
import { createInitialFormData } from '@/utils/createInitialFormData';
import { createTaskLabels } from '@/utils/createTaskLabels';
import BasicInfoForm from './BasicInfoForm';
import { BottomActionBar } from './BottomActionBar';
import ChecklistHeader from './ChecklistHeader';
import { DuringHoursReminder } from './DuringHoursReminder';
import { NotesSection } from './NotesSection';
import { PrepSection } from './PrepSection';
import { TaskSection } from './TaskSection';
import { RecentSaves } from './RecentSaves';

export default function RestaurantChecklistApp() {
  const [formData, setFormData] = useState<FormData>(createInitialFormData());

  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
    beforeOpen: true,
    prep: false,
    afterClose: true,
    closingPrep: false,
    notes: false,
  });

  const [savedChecklists, setSavedChecklists] = useState<SavedChecklist[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const taskLabels = createTaskLabels();

  const handleInputChange = (field: keyof FormData, value: string): void => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTaskChange = (
    category: TaskCategory,
    task: string,
    checked: boolean
  ): void => {
    setFormData((prev) => ({
      ...prev,
      [category]: { ...prev[category], [task]: checked },
    }));
  };

  const handlePrepQuantityChange = (item: PrepItem, value: string): void => {
    setFormData((prev) => ({
      ...prev,
      prepQuantities: { ...prev.prepQuantities, [item]: value },
    }));
  };

  const toggleSection = (section: string): void => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const getTaskLabel = (key: string): string => {
    return (
      taskLabels[key] ||
      key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())
    );
  };

  const calculateOverallProgress = (): number => {
    let taskCompletion: Record<string, boolean> = {}; // ✅ Fixed variable name to avoid confusion

    if (formData.shift === 'opening') {
      taskCompletion = { ...formData.openingTasks };
    } else {
      taskCompletion = { ...formData.closingTasks };
    }

    // Add prep completion - convert string values to boolean
    Object.keys(formData.prepQuantities).forEach((key) => {
      const prepKey = key as PrepItem;
      taskCompletion[`prep_${key}`] = Boolean(
        formData.prepQuantities[prepKey] &&
          formData.prepQuantities[prepKey].trim() !== ''
      );
    });

    const completed = Object.values(taskCompletion).filter(Boolean).length;
    const total = Object.values(taskCompletion).length;
    return Math.round((completed / total) * 100);
  };

  const handleSave = (): void => {
    if (!formData.managerName.trim()) {
      alert('Please enter manager name before saving.');
      return;
    }

    const checklist: SavedChecklist = {
      id: Date.now(),
      ...formData,
      savedAt: new Date().toISOString(),
    };
    setSavedChecklists((prev) => [checklist, ...prev]);
    alert('✅ Checklist saved successfully!');
  };

  const handleDownload = (): void => {
    const dataStr = JSON.stringify(formData, null, 2);
    const dataUri =
      'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `checklist_${formData.date}_${
      formData.managerName || 'manager'
    }.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className='min-h-screen bg-gray-50 pb-24'>
      <ChecklistHeader
        overallProgress={calculateOverallProgress()}
        showSetupWarning={true}
        title='ChrisnEddys Manager Checklist'
      />

      <div className='p-4'>
        <div className='bg-white rounded-lg shadow-sm border p-4 mb-4'>
          <BasicInfoForm
            formData={formData}
            onInputChange={handleInputChange}
            showTilFields={formData.shift === 'opening'}
          />
        </div>

        {formData.shift === 'opening' ? (
          <>
            <TaskSection
              title='Before Open'
              tasks={formData.openingTasks}
              category='openingTasks'
              icon={Clock}
              sectionKey='beforeOpen'
              color='bg-blue-500'
              isExpanded={expandedSections.beforeOpen}
              onToggle={toggleSection}
              onTaskChange={handleTaskChange}
              getTaskLabel={getTaskLabel}
            />

            <PrepSection
              title='Prep Completed'
              sectionKey='prep' // ✅ Fixed: was closingPrep, should be prep for opening
              color='bg-green-500'
              prepQuantities={formData.prepQuantities}
              onPrepQuantityChange={handlePrepQuantityChange}
              isExpanded={expandedSections.prep} // ✅ Fixed: use prep instead of closingPrep
              onToggle={toggleSection}
              getTaskLabel={getTaskLabel}
            />
          </>
        ) : (
          // ✅ Added missing closing section
          <>
            <TaskSection
              title='After Close Manager Sign-off'
              tasks={formData.closingTasks}
              category='closingTasks'
              icon={CheckCircle2}
              sectionKey='afterClose'
              color='bg-purple-500'
              isExpanded={expandedSections.afterClose}
              onToggle={toggleSection}
              onTaskChange={handleTaskChange}
              getTaskLabel={getTaskLabel}
            />

            <PrepSection
              title='Prep Completed'
              sectionKey='closingPrep'
              color='bg-green-500'
              prepQuantities={formData.prepQuantities}
              onPrepQuantityChange={handlePrepQuantityChange}
              isExpanded={expandedSections.closingPrep}
              onToggle={toggleSection}
              getTaskLabel={getTaskLabel}
            />
          </>
        )}

        <DuringHoursReminder />

        <NotesSection
          notes={formData.notes}
          issues={formData.issues}
          onNotesChange={(value) => handleInputChange('notes', value)}
          onIssuesChange={(value) => handleInputChange('issues', value)}
          isExpanded={expandedSections.notes}
          onToggle={toggleSection}
        />

        <RecentSaves savedChecklists={savedChecklists} />
      </div>

      <BottomActionBar
        onSave={handleSave}
        onDownload={handleDownload}
        isLoading={isLoading}
      />
    </div>
  );
}
