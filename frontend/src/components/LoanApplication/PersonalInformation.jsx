// frontend/src/components/LoanApplication/PersonalInformation.jsx
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useLoanApplicationStore } from '../../stores/loanApplicationStore';
import US_STATES from '../../utils/UsStates';
import { formatDateToUS, formatDateToISO } from '../../utils/dateHelpers';

const PersonalInformation = () => {
  const { draft, updatePersonalInfoAttributes, updateAddressesAttributes, nextStep, saveDraftToServer } =
    useLoanApplicationStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    trigger,
    reset,
    getValues,
  } = useForm({
    defaultValues: { ...draft.personalInfoAttributes, ...draft.addressesAttributes?.[0] },
    mode: 'onBlur',
  });

  // Update form when draft changes
  useEffect(() => {
    reset({
      ...draft.personalInfoAttributes,
      dob: draft.personalInfoAttributes?.dob ? formatDateToISO(draft.personalInfoAttributes?.dob) : null,
      ...draft.addressesAttributes?.[0],
    });
  }, [draft.personalInfoAttributes, draft.addressesAttributes, reset]);

  const validateAge = (value) => {
    if (!value) return 'Date of birth is required';
    const age = new Date().getFullYear() - new Date(value).getFullYear();
    return age >= 18 || 'You must be at least 18 years old';
  };

  const validatePhone = (value) => {
    if (!value) return 'Phone number is required';
    const digits = value.replace(/\D/g, '');
    return digits.length === 10 || 'Please enter a valid 10-digit phone number';
  };

  const validateSSN = (value) => {
    if (!value) return 'SSN is required';
    const digits = value.replace(/\D/g, '');
    return digits.length === 9 || 'Please enter a valid 9-digit SSN';
  };

  const handleSaveDraft = async () => {
    const isValid = await trigger();
    if (!isValid) {
      return;
    }
    const formData = getValues();
    updatePersonalInfoAttributes({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      dob: formatDateToUS(formData.dob),
      ssn: formData.ssn,
    });
    updateAddressesAttributes([
      {
        addressStreet: formData.addressStreet,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
      },
    ]);
    try {
      await saveDraftToServer();
      toast.success('Draft saved successfully!');
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error('Failed to save draft. Please try again.');
    }
  };

  const onSubmit = (data) => {
    updatePersonalInfoAttributes({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      dob: formatDateToUS(data.dob),
      ssn: data.ssn,
    });
    updateAddressesAttributes([
      {
        addressStreet: data.addressStreet,
        city: data.city,
        state: data.state,
        zip: data.zip,
      },
    ]);
    nextStep();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8 mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Personal Information</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="firstName" className="block text-left text-sm font-medium text-gray-700 mb-2">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="firstName"
              {...register('firstName', {
                required: 'First name is required',
                pattern: {
                  value: /^[A-Za-z\s]+$/,
                  message: 'First name should only contain letters',
                },
              })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.firstName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter first name"
            />
            {errors.firstName && <p className="mt-1 text-sm text-red-500">{errors.firstName.message}</p>}
          </div>

          <div>
            <label htmlFor="lastName" className="block text-left text-sm font-medium text-gray-700 mb-2">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="lastName"
              {...register('lastName', {
                required: 'Last name is required',
                pattern: {
                  value: /^[A-Za-z\s]+$/,
                  message: 'Last name should only contain letters',
                },
              })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.lastName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter last name"
            />
            {errors.lastName && <p className="mt-1 text-sm text-red-500">{errors.lastName.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="email" className="block text-left text-sm font-medium text-gray-700 mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Please enter a valid email address',
                },
              })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="example@email.com"
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="phone" className="block text-left text-sm font-medium text-gray-700 mb-2">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              {...register('phoneNumber', { validate: validatePhone })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="(555) 123-4567"
            />
            {errors.phoneNumber && <p className="mt-1 text-sm text-red-500">{errors.phoneNumber.message}</p>}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="dob" className="block text-left text-sm font-medium text-gray-700 mb-2">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="dob"
              {...register('dob', { validate: validateAge })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.dob ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.dob && <p className="mt-1 text-sm text-red-500">{errors.dob.message}</p>}
          </div>

          <div>
            <label htmlFor="ssn" className="block text-left text-sm font-medium text-gray-700 mb-2">
              SSN <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="ssn"
              {...register('ssn', { validate: validateSSN })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.ssn ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="XXX-XX-XXXX"
              maxLength="11"
            />
            {errors.ssn && <p className="mt-1 text-sm text-red-500">{errors.ssn.message}</p>}
          </div>
        </div>
        <div>
          <label htmlFor="streetAddress" className="block text-left text-sm font-medium text-gray-700 mb-2">
            Street Address <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="streetAddress"
            {...register('addressStreet', { required: 'Street address is required' })}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.addressStreet ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="123 Main Street"
          />
          {errors.addressStreet && <p className="mt-1 text-sm text-red-500">{errors.addressStreet.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="city" className="block text-left text-sm font-medium text-gray-700 mb-2">
              City <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="city"
              {...register('city', { required: 'City is required' })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.city ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="City"
            />
            {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city.message}</p>}
          </div>

          <div>
            <label htmlFor="state" className="block text-left text-sm font-medium text-gray-700 mb-2">
              State <span className="text-red-500">*</span>
            </label>
            <select
              id="state"
              {...register('state', { required: 'State is required' })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.state ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              {US_STATES.map((state) => (
                <option key={state.value} value={state.value}>
                  {state.label}
                </option>
              ))}
            </select>
            {errors.state && <p className="mt-1 text-sm text-red-500">{errors.state.message}</p>}
          </div>

          <div>
            <label htmlFor="zipCode" className="block text-left text-sm font-medium text-gray-700 mb-2">
              ZIP Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="zipCode"
              {...register('zip', {
                required: 'ZIP code is required',
                pattern: {
                  value: /^\d{5}$/,
                  message: 'Please enter a valid 5-digit ZIP code',
                },
              })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.zip ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="12345"
              maxLength="5"
            />
            {errors.zip && <p className="mt-1 text-sm text-red-500">{errors.zip.message}</p>}
          </div>
        </div>
        <div className="flex justify-between pt-6 border-t border-gray-200">
          <div />

          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={isSubmitting}
            className="px-6 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving...' : 'Save Draft'}
          </button>

          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default PersonalInformation;
