import React, { useState } from 'react';

function LoanOfficerReview() {
  const [criteria, setCriteria] = useState('');
  const completeness = 60;
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col justify-between items-start mb-8">
          <h1 className="text-4xl font-bold text-gray-700 mb-2 text-left">Review Application</h1>
          <p className="text-gray-600">Application #AL-2025-12345</p>
        </div>
        <section className="flex flex-row items-start justify-between gap-6">
          <div className="sm:w-3/4 flex flex-col bg-white shadow-lg rounded-lg p-5 gap-5 ">
            <div>
              <h2 className="text-gray-600 text-xl font-bold mb-2">Personal Information</h2>
              <div className="flex flex-wrap">
                <div className="w-1/2">
                  <label className="text-gray-500 text-md font-normal">Full name</label>
                  <h2 className="text-gray-600 text-md font-bold">John Doe</h2>
                </div>
                <div className="w-1/2">
                  <label className="text-gray-500 text-md font-normal">Email</label>
                  <h2 className="text-gray-600 text-md font-bold">johndoe@mail.com</h2>
                </div>
                <div className="w-1/2">
                  <label className="text-gray-500 text-md font-normal pt-2">Phone number</label>
                  <h2 className="text-gray-600 text-md font-bold">(555)123-4567</h2>
                </div>
                <div className="w-1/2">
                  <label className="text-gray-500 text-md font-normal pt-2">Date of Birth</label>
                  <h2 className="text-gray-600 text-md font-bold">01/15/1990</h2>
                </div>
                <hr className="mt-5 border-t border-0 w-full border-gray-300 " />
              </div>
            </div>
            <div>
              <h2 className="text-gray-600 text-xl font-bold mb-2">Vehicle Details</h2>
              <div className="flex flex-wrap">
                <div className="w-1/2">
                  <label className="text-gray-500 text-md font-normal">Vehicle</label>
                  <h2 className="text-gray-600 text-md font-bold">2024 Honda Civic EX</h2>
                </div>
                <div className="w-1/2">
                  <label className="text-gray-500 text-md font-normal">VIN</label>
                  <h2 className="text-gray-600 text-md font-bold">1HGCV1F32FA123456</h2>
                </div>
                <div className="w-1/2">
                  <label className="text-gray-500 text-md font-normal pt-2">Purchase Price</label>
                  <h2 className="text-gray-600 text-md font-bold">$30,000</h2>
                </div>
                <div className="w-1/2">
                  <label className="text-gray-500 text-md font-normal pt-2">Down Payment</label>
                  <h2 className="text-gray-600 text-md font-bold">$5,000</h2>
                </div>
                <hr className="mt-5 border-t border-0 w-full border-gray-300 " />
              </div>
            </div>
            <div>
              <h2 className="text-gray-600 text-xl font-bold mb-2">Loan Details</h2>
              <div className="flex flex-wrap">
                <div className="w-1/2">
                  <label className="text-gray-500 text-md font-normal">Loan Amount</label>
                  <h2 className="text-gray-600 text-md font-bold">$25,000</h2>
                </div>
                <div className="w-1/2">
                  <label className="text-gray-500 text-md font-normal">Term</label>
                  <h2 className="text-gray-600 text-md font-bold">48 months</h2>
                </div>
                <hr className="mt-5 border-t border-0 w-full border-gray-300 " />
              </div>
            </div>
            <div>
              <h2 className="text-gray-600 text-xl font-bold mb-2">Loan Details</h2>
              <div className="flex flex-col gap-3">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2 cursor-pointer" />
                  Personal Information
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2 cursor-pointer" />
                  Vehicle Information
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2 cursor-pointer" />
                  Financial Information
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2 cursor-pointer" />
                  Documents Uploaded
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2 cursor-pointer" />
                  Credit Check Authorized
                </label>
              </div>
              <hr className="my-6 border-t border-0 w-full border-gray-300 " />
            </div>
            <div>
              <h2 className="text-gray-600 text-xl font-bold mb-2">Eligibility Assessment</h2>
              <div className="flex gap-4 flex-col">
                <h2>Meets Lending Criteria?</h2>
                <select
                  value={criteria}
                  onChange={(e) => setCriteria(e.target.value)}
                  className="w-full bg-white border border-gray-300 text-gray-600  rounded-lg px-3 py-2 focus:outline-none cursor-pointer"
                >
                  <option value="yes" selected>
                    Yes - Eligible
                  </option>
                  <option value="no">No - Denied</option>
                </select>
                <h2>Officer Notes</h2>
                <textarea
                  rows={4}
                  placeholder="Add any observations or concerns..."
                  className="w-full bg-white border border-gray-300 text-gray-800  rounded-lg px-3 py-2 focus:outline-none cursor-auto"
                />
              </div>
            </div>
            <div className="flex flex-wrap justify-between ">
              <button className="  bg-gray-400 hover:bg-gray-500 text-white  py-2 px-4 rounded-lg transition shadow-lg cursor-pointer">
                Cancel
              </button>
              <button className="  bg-blue-600 hover:bg-blue-700 text-white  py-2 px-4 rounded-lg transition shadow-lg cursor-pointer">
                Save & Send to UnderWriting
              </button>
            </div>
          </div>
          <div className="sm:w-1/4 flex flex-col bg-white shadow-lg rounded-lg p-5 gap-1">
            <h2 className="text-gray-600 text-xl font-bold mb-2">Application Status</h2>
            <h3 className="text-gray-500 text-md font-normal">Current Status</h3>
            <p className="w-fit bg-yellow-400 px-2 rounded-lg text-gray-800 ">Pending</p>
            <h3 className="text-gray-500 text-md font-normal">Submitted Date</h3>
            <p className="text-gray-600 text-md font-bold">Dec 1, 2025</p>
            <h3 className="text-gray-500 text-md font-normal">Last Updated</h3>
            <p className="text-gray-600 text-md font-bold">Dec 1, 2025</p>
            <h3 className="text-gray-500 text-md font-normal">Completeness</h3>
            <div className="w-full relative bg-slate-100 rounded-lg h-5 shadow-inner">
              <div className="h-full rounded-lg bg-yellow-400" style={{ width: `${completeness}%` }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-slate-800 drop-shadow-sm">{completeness}%</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default LoanOfficerReview;
