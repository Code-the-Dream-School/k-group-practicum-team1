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

      loadDraftFromServer: async (applicationId) => {
        // TODO: Implement API call to load draft
        console.log('Loading draft from server:', applicationId);
        console.log('draft:', this.draft);
        // const response = await fetch(`/api/applications/draft/${applicationId}`);
        // const data = await response.json();
        // set({ draft: data });
        return Promise.resolve();
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
