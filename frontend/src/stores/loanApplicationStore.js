import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import humps from 'humps';
import { STEPS } from '../constants/stepperConstant';
import { fetchApplicationById, createApplication, updateApplication } from '../services/applicationApi';

export const useLoanApplicationStore = create(
  persist(
    (set, get) => ({
      currentStep: 1,
      applicationId: null,
      draft: {
        personalInfoAttributes: null,
        addressesAttributes: null,
        vehicleAttributes: null,
        financialInfoAttributes: null,
        applicationProgress: 'personal',
        documentsAttributes: [],
      },

      updatePersonalInfoAttributes: (data) =>
        set((state) => ({
          draft: {
            ...state.draft,
            personalInfoAttributes: {
              ...state.draft.personalInfoAttributes,
              ...data,
            },
          },
        })),

      updateAddressesAttributes: (data) =>
        set((state) => ({
          draft: {
            ...state.draft,
            addressesAttributes: data,
          },
        })),

      updateVehicleAttributes: (data) =>
        set((state) => ({
          draft: {
            ...state.draft,
            purchasePrice: data.purchasePrice || state.draft.purchasePrice,
            vehicleAttributes: {
              ...state.draft.vehicleAttributes,
              ...data,
            },
          },
        })),

      updateFinancialInfoAttributes: (data) =>
        set((state) => ({
          draft: {
            ...state.draft,
            financialInfoAttributes: {
              ...state.draft.financialInfoAttributes,
              ...data,
            },
          },
        })),

      updateLoanDetails: (data) =>
        set((state) => ({
          draft: {
            ...state.draft,
            ...data,
          },
        })),

      updateDocuments: (documents) =>
        set((state) => ({
          draft: {
            ...state.draft,
            documentsAttributes: documents,
          },
        })),

      nextStep: () =>
        set((state) => ({
          currentStep: Math.min(state.currentStep + 1, 6),
        })),

      previousStep: () =>
        set((state) => ({
          currentStep: Math.max(state.currentStep - 1, 1),
        })),

      goToStep: (step) =>
        set(() => ({
          currentStep: step,
        })),

      saveDraftToServer: async () => {
        const { draft, currentStep, applicationId } = get();

        const applicationProgress = STEPS[currentStep - 1]?.key || 'personal';
        console.log('Current application progress key:', applicationProgress);
        const snakeCaseDraft = humps.decamelizeKeys({ ...draft, applicationProgress: applicationProgress });
        console.log('Saving draft to server (snake_case):', snakeCaseDraft);

        let data = null;
        if (!applicationId) {
          data = await createApplication(snakeCaseDraft);
        } else {
          data = await updateApplication(applicationId, snakeCaseDraft);
        }

        console.log('Draft saved successfully:', data);
        set({ applicationId: data.id });
        return Promise.resolve();
      },

      clearDraft: () =>
        set({
          currentStep: 1,
          draft: {
            personalInfoAttributes: null,
            addressesAttributes: null,
            vehicleAttributes: null,
            financialInfoAttributes: null,
            applicationProgress: 'personal',
            documents: [],
          },
          applicationId: null,
        }),

      loadDraftFromServer: async (applicationId, isEditing) => {
        const data = await fetchApplicationById(applicationId);
        if (data) {
          console.log('load draft before camelize:', data);
          const camelizedData = humps.camelizeKeys(data);

          const documentsFromAPI = (camelizedData.documents || []).map((doc) => ({
            id: doc.id,
            document_name: doc.documentName || doc.document_name || 'Unknown',
            description: doc.description || '',
            file_url: doc.url?.url || null,
            file_name: doc.fileName || 'file',
            file_type: doc.fileType || 'unknown',
            file_size: doc.size || 0,
            uploaded_at: doc.uploadedAt || new Date().toISOString(),
          }));

          if (isEditing && camelizedData.status !== 'draft') {
            console.warn('Attempting to edit an application that is not in draft status. Redirecting to dashboard.');
            set({ applicationId: null });
            return Promise.reject(new Error('Cannot edit application that is not in draft status'));
          }
          set({
            draft: {
              purchasePrice: camelizedData.purchasePrice || null,
              loanAmount: camelizedData.loanAmount || null,
              downPayment: camelizedData.downPayment || null,
              termMonths: camelizedData.termMonths || null,
              apr: camelizedData.apr || null,
              submittedDate: camelizedData.submittedDate || null,
              applicationProgress: camelizedData.applicationProgress || 'personal',
              status: camelizedData.status || 'draft',
              personalInfoAttributes: camelizedData.personalInfo || null,
              addressesAttributes: camelizedData.addresses || null,
              vehicleAttributes: camelizedData.vehicle || null,
              financialInfoAttributes: camelizedData.financialInfo || null,
              documentsAttributes: documentsFromAPI || [],
            },
            applicationId: camelizedData.id,
            currentStep: STEPS.findIndex((step) => step.key === camelizedData.applicationProgress) + 1 || 1,
          });

          console.log('Draft loaded successfully from server:', camelizedData);
          return Promise.resolve();
        } else {
          console.log('No draft data found on server for applicationId:', applicationId);
        }
      },
    }),
    {
      name: 'loan-application-storage',
      partialize: (state) => ({
        currentStep: state.currentStep,
        draft: state.draft,
      }),
    }
  )
);
