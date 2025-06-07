// hooks/useSaveLogic.ts
import { useState, useCallback } from 'react';
import { FormData, SavedChecklist } from '@/types';
import {
  saveToGoogleSheets,
  saveToLocalStorage,
  getGoogleSheetsConfig,
  validateFormData,
} from '@/utils/googleSheets';

type SaveStatus = 'idle' | 'saving' | 'success' | 'error';

interface UseSaveLogicReturn {
  isLoading: boolean;
  saveStatus: SaveStatus;
  handleSave: (formData: FormData) => Promise<void>;
  getSaveButtonText: (isOnline: boolean, isGoogleConfigured: boolean) => string;
}

export const useSaveLogic = (
  onSaveSuccess: (checklist: SavedChecklist) => void
): UseSaveLogicReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');

  const googleConfig = getGoogleSheetsConfig();

  const handleSave = useCallback(
    async (formData: FormData): Promise<void> => {
      // Validate form data
      const validation = validateFormData(formData);
      if (!validation.isValid) {
        alert(validation.message);
        return;
      }

      setIsLoading(true);
      setSaveStatus('saving');

      try {
        let result;
        const isOnline = navigator.onLine;

        if (googleConfig.isConfigured && isOnline) {
          // Try Google Sheets first
          result = await saveToGoogleSheets(formData);
        } else {
          // Fall back to local storage
          result = saveToLocalStorage(formData);
        }

        if (result.success) {
          setSaveStatus('success');

          // Create checklist object for callback
          const newChecklist: SavedChecklist = {
            id: parseInt(result.id || Date.now().toString()),
            ...formData,
            savedAt: new Date().toISOString(),
          };

          onSaveSuccess(newChecklist);
          alert(`✅ ${result.message}`);

          // Reset status after 3 seconds
          setTimeout(() => setSaveStatus('idle'), 3000);
        } else {
          throw new Error(result.message);
        }
      } catch (error) {
        setSaveStatus('error');
        console.error('Save error:', error);

        // Try local storage as fallback
        const fallbackResult = saveToLocalStorage(formData);
        if (fallbackResult.success) {
          alert('⚠️ Saved locally. Will sync when online.');
        } else {
          alert('❌ Failed to save. Please try again.');
        }

        setTimeout(() => setSaveStatus('idle'), 3000);
      } finally {
        setIsLoading(false);
      }
    },
    [googleConfig.isConfigured, onSaveSuccess]
  );

  const getSaveButtonText = useCallback(
    (isOnline: boolean, isGoogleConfigured: boolean): string => {
      if (isLoading) return 'Saving...';
      if (saveStatus === 'success') return 'Saved!';
      if (saveStatus === 'error') return 'Try Again';

      if (isGoogleConfigured && isOnline) {
        return 'Save to Sheets';
      } else if (!isOnline) {
        return 'Save Offline';
      } else {
        return 'Save Locally';
      }
    },
    [isLoading, saveStatus]
  );

  return {
    isLoading,
    saveStatus,
    handleSave,
    getSaveButtonText,
  };
};
