// hooks/useFormState.ts
import { useState, useEffect, useCallback } from 'react';
import { FormData, ExpandedSections, TaskCategory, PrepItem } from '@/types';
import { createInitialFormData } from '@/utils/createInitialFormData';

interface UseFormStateReturn {
  formData: FormData;
  expandedSections: ExpandedSections;
  handleInputChange: (field: keyof FormData, value: string | number) => void;
  handleTaskChange: (
    category: TaskCategory,
    task: string,
    checked: boolean
  ) => void;
  handlePrepQuantityChange: (item: PrepItem, value: number) => void;
  toggleSection: (section: string) => void;
  calculateOverallProgress: () => number;
}

export const useFormState = (): UseFormStateReturn => {
  const [formData, setFormData] = useState<FormData>(createInitialFormData());
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
    beforeOpen: true,
    prep: false,
    afterClose: true,
    closingPrep: false,
    notes: false,
  });

  // Update expanded sections when shift changes
  useEffect(() => {
    if (formData.shift === 'opening') {
      setExpandedSections((prev) => ({
        ...prev,
        beforeOpen: true,
        prep: false,
        afterClose: false,
        closingPrep: false,
      }));
    } else {
      setExpandedSections((prev) => ({
        ...prev,
        beforeOpen: false,
        prep: false,
        afterClose: true,
        closingPrep: false,
      }));
    }
  }, [formData.shift]);

  const handleInputChange = useCallback(
    (field: keyof FormData, value: string | number): void => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleTaskChange = useCallback(
    (category: TaskCategory, task: string, checked: boolean): void => {
      setFormData((prev) => ({
        ...prev,
        [category]: { ...prev[category], [task]: checked },
      }));
    },
    []
  );

  const handlePrepQuantityChange = useCallback(
    (item: PrepItem, value: number): void => {
      setFormData((prev) => ({
        ...prev,
        prepQuantities: { ...prev.prepQuantities, [item]: value },
      }));
    },
    []
  );

  const toggleSection = useCallback((section: string): void => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  }, []);

  const calculateOverallProgress = useCallback((): number => {
    let taskCompletion: Record<string, boolean> = {};

    if (formData.shift === 'opening') {
      taskCompletion = { ...formData.openingTasks };
    } else {
      taskCompletion = { ...formData.closingTasks };
    }

    // Add prep completion
    Object.keys(formData.prepQuantities).forEach((key) => {
      const prepKey = key as PrepItem;
      taskCompletion[`prep_${key}`] =
        Boolean(formData.prepQuantities[prepKey]) &&
        Number(formData.prepQuantities[prepKey]) > 0;
    });

    const completed = Object.values(taskCompletion).filter(Boolean).length;
    const total = Object.values(taskCompletion).length;
    return Math.round((completed / total) * 100);
  }, [formData]);

  return {
    formData,
    expandedSections,
    handleInputChange,
    handleTaskChange,
    handlePrepQuantityChange,
    toggleSection,
    calculateOverallProgress,
  };
};
