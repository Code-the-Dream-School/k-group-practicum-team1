import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLoanApplicationStore } from '../../stores/loanApplicationStore';
import { carMakes, carModels, commonTrims } from '../../utils/vehicleData';

const VehicleInformation = () => {
  const { draft, updateVehicleDetails, nextStep, previousStep, saveDraftToServer } = useLoanApplicationStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    defaultValues: draft.vehicleDetails || {},
    mode: 'onBlur',
  });

  const [selectedMake, setSelectedMake] = useState(draft.vehicleDetails?.make || '');

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear + 1 - i);

  const validateVIN = (value) => {
    if (!value) return true; // VIN is optional
    const cleanVIN = value.replace(/\s/g, '');
    if (cleanVIN.length !== 17) {
      return 'VIN must be exactly 17 characters';
    }
    if (!/^[A-HJ-NPR-Z0-9]{17}$/i.test(cleanVIN)) {
      return 'VIN contains invalid characters (I, O, Q not allowed)';
    }
    return true;
  };

  const validateMileage = (value) => {
    if (!value) return true;
    const mileage = parseInt(value, 10);
    if (mileage < 0) {
      return 'Mileage cannot be negative';
    }
    if (mileage > 999999) {
      return 'Please enter a valid mileage';
    }
    return true;
  };

  const validatePrice = (value) => {
    if (!value) return true;
    const price = parseFloat(value);
    if (price < 0) {
      return 'Price cannot be negative';
    }
    if (price > 1000000) {
      return 'Please enter a valid purchase price';
    }
    return true;
  };

  const onSubmit = (data) => {
    updateVehicleDetails(data);
    nextStep();
  };

  const handleSaveDraft = async () => {
    const formData = getValues();
    updateVehicleDetails(formData);

    try {
      await saveDraftToServer();
      alert('Draft saved successfully!');
    } catch {
      alert('Failed to save draft. Please try again.');
    }
  };

  const handlePrevious = () => {
    const formData = getValues();
    updateVehicleDetails(formData);
    previousStep();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8 mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Vehicle Information</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Vehicle Type <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-col sm:flex-row gap-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                value="new"
                {...register('vehicleType', {
                  required: 'Vehicle type is required',
                })}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
              />
              <span className="ml-2 text-gray-700">New</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                value="certified-used"
                {...register('vehicleType', {
                  required: 'Vehicle type is required',
                })}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
              />
              <span className="ml-2 text-gray-700">Certified Used</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                value="used"
                {...register('vehicleType', {
                  required: 'Vehicle type is required',
                })}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
              />
              <span className="ml-2 text-gray-700">Used</span>
            </label>
          </div>
          {errors.vehicleType && <p className="mt-2 text-sm text-red-500">{errors.vehicleType.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
              Year <span className="text-red-500">*</span>
            </label>
            <select
              id="year"
              data-dropdown-trigger="click"
              {...register('year', {
                required: 'Year is required',
              })}
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-white cursor-pointer hover:border-gray-400 ${
                errors.year ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select Year</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            {errors.year && <p className="mt-1 text-sm text-red-500">{errors.year.message}</p>}
          </div>

          <div>
            <label htmlFor="make" className="block text-sm font-medium text-gray-700 mb-2">
              Make <span className="text-red-500">*</span>
            </label>
            <select
              id="make"
              data-dropdown-trigger="click"
              {...register('make', {
                required: 'Make is required',
                onChange: (e) => setSelectedMake(e.target.value),
              })}
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-white cursor-pointer hover:border-gray-400 ${
                errors.make ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select Make</option>
              {carMakes.map((make) => (
                <option key={make} value={make}>
                  {make}
                </option>
              ))}
            </select>
            {errors.make && <p className="mt-1 text-sm text-red-500">{errors.make.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-2">
              Model <span className="text-red-500">*</span>
            </label>
            <select
              id="model"
              data-dropdown-trigger="click"
              {...register('model', {
                required: 'Model is required',
              })}
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-white cursor-pointer hover:border-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                errors.model ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={!selectedMake}
            >
              <option value="">Select Model</option>
              {carModels[selectedMake]?.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
            {errors.model && <p className="mt-1 text-sm text-red-500">{errors.model.message}</p>}
          </div>

          <div>
            <label htmlFor="trim" className="block text-sm font-medium text-gray-700 mb-2">
              Trim
            </label>
            <select
              id="trim"
              data-dropdown-trigger="click"
              {...register('trim')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-white cursor-pointer hover:border-gray-400"
            >
              <option value="">Select Trim (Optional)</option>
              {commonTrims.map((trim) => (
                <option key={trim} value={trim}>
                  {trim}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="vin" className="block text-sm font-medium text-gray-700 mb-2">
            VIN (Vehicle Identification Number)
          </label>
          <input
            type="text"
            id="vin"
            placeholder="17-character VIN (optional)"
            maxLength={17}
            {...register('vin', {
              validate: validateVIN,
            })}
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase ${
              errors.vin ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.vin && <p className="mt-1 text-sm text-red-500">{errors.vin.message}</p>}
          <p className="mt-1 text-xs text-gray-500">VIN can be found on your vehicle registration or dashboard</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="mileage" className="block text-sm font-medium text-gray-700 mb-2">
              Mileage <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="mileage"
              placeholder="25000"
              {...register('mileage', {
                required: 'Mileage is required',
                validate: validateMileage,
              })}
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.mileage ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.mileage && <p className="mt-1 text-sm text-red-500">{errors.mileage.message}</p>}
          </div>

          <div>
            <label htmlFor="purchasePrice" className="block text-sm font-medium text-gray-700 mb-2">
              Purchase Price <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-2 text-gray-500">$</span>
              <input
                type="number"
                id="purchasePrice"
                placeholder="32000"
                step="0.01"
                {...register('purchasePrice', {
                  required: 'Purchase price is required',
                  validate: validatePrice,
                })}
                className={`w-full pl-8 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.purchasePrice ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.purchasePrice && <p className="mt-1 text-sm text-red-500">{errors.purchasePrice.message}</p>}
          </div>
        </div>

        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handlePrevious}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Previous
          </button>

          <button
            type="button"
            onClick={handleSaveDraft}
            className="px-6 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
          >
            Save Draft
          </button>

          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default VehicleInformation;
