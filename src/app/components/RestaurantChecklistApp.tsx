'use client';
import React, { useState, useEffect } from 'react';
import { SavedChecklist, PrepQuantities } from '@/types';
import {
  getLocalChecklists,
  getGoogleSheetsConfig,
} from '@/utils/googleSheets';
import { createTaskLabels } from '@/utils/createTaskLabels';

// Custom Hooks
import { useFormState } from '../hooks/useFormState';
import { useSaveLogic } from '../hooks/useSaveLogic';

// Components
import BasicInfoForm from './BasicInfoForm';
import { BottomActionBar } from './BottomActionBar';
import ChecklistHeader from './ChecklistHeader';
import { ConnectionStatus } from './ConnectionStatus';
import { ChecklistSections } from './CheckListSections';
import { NotesSection } from './NotesSection';
import { RecentSaves } from './RecentSaves';

export default function RestaurantChecklistApp() {
  // External state
  const [savedChecklists, setSavedChecklists] = useState<SavedChecklist[]>([]);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  // Custom hooks
  const {
    formData,
    expandedSections,
    handleInputChange,
    handleTaskChange,
    handlePrepQuantityChange,
    toggleSection,
    calculateOverallProgress,
  } = useFormState();

  const { isLoading, handleSave, getSaveButtonText } = useSaveLogic(
    (newChecklist) => {
      setSavedChecklists((prev) => [newChecklist, ...prev.slice(0, 9)]);
    }
  );

  // Configuration
  const taskLabels = createTaskLabels();
  const googleConfig = getGoogleSheetsConfig();

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load local checklists on mount
  useEffect(() => {
    const localChecklists = getLocalChecklists();
    setSavedChecklists(localChecklists);
  }, []);

  // Utility functions
  const getTaskLabel = (key: keyof PrepQuantities): string => {
    return (
      taskLabels[key as string] ||
      (key as string)
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (str) => str.toUpperCase())
    );
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
        showSetupWarning={!googleConfig.isConfigured}
        title='Manager Checklist'
      />

      <div className='p-4'>
        <ConnectionStatus
          isOnline={isOnline}
          isGoogleConfigured={googleConfig.isConfigured}
        />

        <div className='bg-white rounded-lg shadow-sm border p-4 mb-4'>
          <BasicInfoForm
            formData={formData}
            onInputChange={handleInputChange}
            showTilFields={formData.shift === 'opening'}
          />
        </div>

        <ChecklistSections
          formData={formData}
          expandedSections={expandedSections}
          onToggleSection={toggleSection}
          onTaskChange={handleTaskChange}
          onPrepQuantityChange={handlePrepQuantityChange}
          getTaskLabel={getTaskLabel}
        />

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
        onSave={() => handleSave(formData)}
        onDownload={handleDownload}
        isLoading={isLoading}
        saveText={getSaveButtonText(isOnline, googleConfig.isConfigured)}
      />
    </div>
  );
}
