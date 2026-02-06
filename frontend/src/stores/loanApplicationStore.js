import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import humps from 'humps';
import { STEPS } from '../constants/stepperConstant';
import { apiFetch } from '../services/api';

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
        // documentsAttributes: null,
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
            purchasePrice: state.draft.purchasePrice,
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

        let response = null;
        if (!applicationId) {
          response = await apiFetch(`/api/v1/applications`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ application: snakeCaseDraft }),
          });
        } else {
          response = await apiFetch(`/api/v1/applications/${applicationId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ application: snakeCaseDraft }),
          });
        }

        const { data } = response;
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
            // documents: [],
          },
          applicationId: null,
        }),

      loadDraftFromServer: async (applicationId, isEditing) => {
        const response = await apiFetch(`/api/v1/applications/${applicationId}`, {
          method: 'GET',
        });
        if (response.data) {
          console.log('load draft before camelize:', response.data);
          const data = humps.camelizeKeys(response.data);

          if (isEditing && data.status !== 'draft') {
            console.warn('Attempting to edit an application that is not in draft status. Redirecting to dashboard.');
            set({ applicationId: null });
            return Promise.reject(new Error('Cannot edit application that is not in draft status'));
          }
          set({
            draft: {
              purchasePrice: data.purchasePrice || null,
              loanAmount: data.loanAmount || null,
              downPayment: data.downPayment || null,
              termMonths: data.termMonths || null,
              apr: data.apr || null,
              submittedDate: data.submittedDate || null,
              applicationProgress: data.applicationProgress || 'personal',
              status: data.status || 'draft',
              personalInfoAttributes: data.personalInfo || null,
              addressesAttributes: data.addresses || null,
              vehicleAttributes: data.vehicle || null,
              financialInfoAttributes: data.financialInfo || null,
            },
            applicationId: data.id,
            currentStep: STEPS.findIndex((step) => step.key === data.applicationProgress) + 1 || 1,
          });

          console.log('Draft loaded successfully from server:', data);
          return Promise.resolve();
        } else {
          console.log('No draft data found on server for applicationId:', applicationId);
          // set({ draft: data });
          // return Promise.resolve();
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
