import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useLoanApplicationStore = create(
  persist(
    (set, get) => ({
      currentStep: 1,

      draft: {
        personalInfo: {
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          dateOfBirth: '',
          ssn: '',
          streetAddress: '',
          city: '',
          state: '',
          zipCode: '',
        },
        vehicleDetails: {},
        financialInfo: {},
        loanDetails: {},
        documents: [],
      },

      updatePersonalInfo: (data) =>
        set((state) => ({
          draft: {
            ...state.draft,
            personalInfo: {
              ...state.draft.personalInfo,
              ...data,
            },
          },
        })),

      updateVehicleDetails: (data) =>
        set((state) => ({
          draft: {
            ...state.draft,
            vehicleDetails: {
              ...state.draft.vehicleDetails,
              ...data,
            },
          },
        })),

      updateFinancialInfo: (data) =>
        set((state) => ({
          draft: {
            ...state.draft,
            financialInfo: {
              ...state.draft.financialInfo,
              ...data,
            },
          },
        })),

      updateLoanDetails: (data) =>
        set((state) => ({
          draft: {
            ...state.draft,
            loanDetails: {
              ...state.draft.loanDetails,
              ...data,
            },
          },
        })),

      nextStep: () =>
        set((state) => ({
          currentStep: Math.min(state.currentStep + 1, 5),
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
        const { draft } = get();
        console.log('Saving draft to server:', draft);
        // const response = await fetch('/api/applications/draft', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(draft),
        // });
        return Promise.resolve();
      },

      clearDraft: () =>
        set({
          currentStep: 1,
          draft: {
            personalInfo: {
              firstName: '',
              lastName: '',
              email: '',
              phone: '',
              dateOfBirth: '',
              ssn: '',
              streetAddress: '',
              city: '',
              state: '',
              zipCode: '',
            },
            vehicleDetails: {},
            financialInfo: {},
            loanDetails: {},
            documents: [],
          },
        }),

      loadDraftFromServer: async (applicationId) => {
        // TODO: Implement API call to load draft
        console.log('Loading draft from server:', applicationId);
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
