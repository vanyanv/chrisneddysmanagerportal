import { FormData } from '@/types';

export interface GoogleSheetsConfig {
  scriptUrl: string;
  isConfigured: boolean;
}

export interface SaveResponse {
  success: boolean;
  message: string;
  id?: string;
}

// Google Sheets configuration
export const getGoogleSheetsConfig = (): GoogleSheetsConfig => {
  const scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL || '';
  return {
    scriptUrl,
    isConfigured:
      scriptUrl !== '' && scriptUrl !== 'YOUR_GOOGLE_SCRIPT_URL_HERE',
  };
};

// Calculate completion percentages for sections
const calculateCompletion = (tasks: Record<string, boolean>): number => {
  const completed = Object.values(tasks).filter(Boolean).length;
  const total = Object.values(tasks).length;
  return Math.round((completed / total) * 100);
};

// ✅ FIXED: PrepQuantities as numbers
const calculatePrepCompletion = (
  prepQuantities: Record<string, number>
): number => {
  const completed = Object.values(prepQuantities).filter(
    (qty) => qty > 0 // ✅ Check for positive numbers
  ).length;
  const total = Object.values(prepQuantities).length;
  return Math.round((completed / total) * 100);
};

// Transform form data for Google Sheets
export const transformDataForSheets = (formData: FormData) => {
  const openingComplete = calculateCompletion(formData.openingTasks);
  const closingComplete = calculateCompletion(formData.closingTasks);
  const prepComplete = calculatePrepCompletion(formData.prepQuantities);

  // Calculate overall completion based on shift
  const relevantTaskCompletion =
    formData.shift === 'opening' ? openingComplete : closingComplete;
  const overallComplete = Math.round(
    (relevantTaskCompletion + prepComplete) / 2
  );

  const transformedData = {
    // Basic Info
    date: formData.date,
    managerName: formData.managerName,
    shift: formData.shift,
    startingTil: formData.startingTil,
    endingTil: formData.endingTil,
    tilDifference: formData.endingTil - formData.startingTil,

    // Completion Percentages
    openingComplete: formData.shift === 'opening' ? openingComplete : 0,
    closingComplete: formData.shift === 'closing' ? closingComplete : 0,
    prepComplete,
    overallComplete,

    // Notes
    notes: formData.notes,
    issues: formData.issues,

    // Timestamp
    timestamp: new Date().toISOString(),

    // Detailed Task Data (as JSON strings for Google Sheets)
    openingTasksDetail: JSON.stringify(formData.openingTasks),
    closingTasksDetail: JSON.stringify(formData.closingTasks),
    prepQuantitiesDetail: JSON.stringify(formData.prepQuantities),
  };

  // ✅ ADD THIS DEBUG LOG
  console.log('🚀 REACT: Transform data for sheets:', transformedData);
  console.log('🔍 REACT: Data types check:');
  console.log(
    '  tilDifference:',
    transformedData.tilDifference,
    typeof transformedData.tilDifference
  );
  console.log(
    '  openingComplete:',
    transformedData.openingComplete,
    typeof transformedData.openingComplete
  );
  console.log(
    '  closingComplete:',
    transformedData.closingComplete,
    typeof transformedData.closingComplete
  );
  console.log(
    '  prepComplete:',
    transformedData.prepComplete,
    typeof transformedData.prepComplete
  );
  console.log(
    '  overallComplete:',
    transformedData.overallComplete,
    typeof transformedData.overallComplete
  );

  return transformedData;
};

// ✅ ENHANCED: Save data to Google Sheets with better error handling
export const saveToGoogleSheets = async (
  formData: FormData
): Promise<SaveResponse> => {
  const config = getGoogleSheetsConfig();

  if (!config.isConfigured) {
    throw new Error(
      'Google Sheets not configured. Please add NEXT_PUBLIC_GOOGLE_SCRIPT_URL to environment variables.'
    );
  }

  try {
    const transformedData = transformDataForSheets(formData);

    // ✅ ADDED: Log the data being sent for debugging
    console.log('🚀 Sending data to Google Sheets:', transformedData);
    console.log('🔗 Script URL:', config.scriptUrl);

    const response = await fetch(config.scriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transformedData),
      mode: 'no-cors', // Required for Google Apps Script
    });

    // ✅ ADDED: More detailed logging
    console.log('✅ Request sent to Google Sheets');
    console.log('📊 Check your Google Sheet for new data');
    console.log(response);

    // Note: With no-cors mode, we can't read the response
    // We'll assume success if no error is thrown
    return {
      success: true,
      message: 'Checklist saved to Google Sheets successfully!',
      id: Date.now().toString(),
    };
  } catch (error) {
    console.error('❌ Error saving to Google Sheets:', error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Failed to save to Google Sheets',
    };
  }
};

// Validate manager name before saving
export const validateFormData = (
  formData: FormData
): { isValid: boolean; message?: string } => {
  if (!formData.managerName.trim()) {
    return {
      isValid: false,
      message: 'Please enter manager name before saving.',
    };
  }

  if (
    formData.shift === 'opening' &&
    formData.startingTil === 0 &&
    formData.endingTil === 0
  ) {
    return {
      isValid: false,
      message: 'Please enter til amounts for opening shift.',
    };
  }

  return { isValid: true };
};

// Local storage fallback functions
export const saveToLocalStorage = (formData: FormData): SaveResponse => {
  try {
    const existingData = localStorage.getItem('restaurant_checklists');
    const checklists = existingData ? JSON.parse(existingData) : [];

    const newChecklist = {
      id: Date.now(),
      ...formData,
      savedAt: new Date().toISOString(),
    };

    checklists.unshift(newChecklist); // Add to beginning

    // Keep only last 50 checklists
    if (checklists.length > 50) {
      checklists.splice(50);
    }

    localStorage.setItem('restaurant_checklists', JSON.stringify(checklists));

    return {
      success: true,
      message: 'Checklist saved locally!',
      id: newChecklist.id.toString(),
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : 'Failed to save locally',
    };
  }
};

interface SavedChecklist extends FormData {
  id: number;
  savedAt: string;
}

export const getLocalChecklists = (): SavedChecklist[] => {
  try {
    const data = localStorage.getItem('restaurant_checklists');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

// ✅ ADDED: Debug function to test the connection
export const testGoogleSheetsConnection = async (): Promise<SaveResponse> => {
  const config = getGoogleSheetsConfig();

  if (!config.isConfigured) {
    return {
      success: false,
      message:
        'Google Sheets not configured - check NEXT_PUBLIC_GOOGLE_SCRIPT_URL',
    };
  }

  const testData = {
    date: new Date().toISOString().split('T')[0],
    managerName: 'Test Manager',
    shift: 'opening',
    startingTil: 100,
    endingTil: 500,
    tilDifference: 400,
    openingComplete: 95,
    closingComplete: 0,
    prepComplete: 80,
    overallComplete: 87,
    notes: 'Test submission from React app',
    issues: 'This is a test - you can delete this row',
    timestamp: new Date().toISOString(),
    openingTasksDetail: JSON.stringify({
      brushOutside: true,
      setupCleanTables: true,
    }),
    closingTasksDetail: JSON.stringify({}),
    prepQuantitiesDetail: JSON.stringify({
      meat: 5,
      sauceBatches: 3,
      sauceCups: 50,
    }), // ✅ Numbers in JSON
  };

  console.log('🧪 Testing Google Sheets connection...');
  console.log('🔗 URL:', config.scriptUrl);
  console.log('📤 Test data:', testData);

  try {
    await fetch(config.scriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
      mode: 'no-cors',
    });

    console.log('✅ Test request sent successfully');
    console.log('📊 Check your Google Sheet for test data');

    return {
      success: true,
      message: 'Test sent to Google Sheets - check your spreadsheet!',
      id: 'test-' + Date.now(),
    };
  } catch (error) {
    console.error('❌ Test failed:', error);
    return {
      success: false,
      message: `Test failed: ${error}`,
    };
  }
};
