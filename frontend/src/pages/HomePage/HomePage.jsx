import React, { useState } from 'react';

function HomePage() {
  const [loanAmount, setLoanAmount] = useState(20000);
  const [month, setMonth] = useState(12);
  const aprOptions = [5, 5.5, 6, 6.5, 7, 7.5, 8];
  const [apr, setApr] = useState(aprOptions[0]);

  const calculateMonthlyPayment = () => {
    const principal = Number(loanAmount);
    const n = Number(month);
    const monthlyRate = apr / 100 / 12;
    if (monthlyRate === 0) return principal / n;
    const payment = (principal * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
    return payment.toFixed(2);
  };
  return (
    <div>
      <section className="relative bg-linear-to-r from-blue-600 to-indigo-700 py-20 px-6 text-center text-white md:py-32">
        <div className="max-w-4xl mx-auto">
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-6xl">
            Get Your Auto Loan in <span className="text-blue-300">15 Minutes</span>
          </h1>

          <p className="mt-6 text-2xl leading-8 text-blue-100 max-w-2xl mx-auto">
            Fast online approval with minimal documentation. Drive away in your new car today.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <a
              href="#"
              className="rounded-md bg-white px-8 py-3 text-sm font-bold text-blue-600 shadow-lg hover:bg-gray-100 transition"
            >
              Apply Now
            </a>
            <a
              href="#"
              className="border border-white text-white px-8 py-2 rounded-md hover:bg-white/10 transition cursor-pointer"
            >
              Calculate Loan
            </a>
          </div>
        </div>
      </section>
      <section className=" bg-gray-100 py-10 px-6 text-center  md:py-12 ">
        <div className="max-w-4xl mx-auto text-blue-500 text-4xl md:text-6x font-black ">Why Choose TurboLoan?</div>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center sm:items-stretch ">
          <div className="shadow-lg w-full sm:w-1/4 sm:min-h-35 max-w-xl bg-white rounded-lg p-6">
            <h2 className="text-gray-700 text-xl font-semibold">Fast Approval</h2>
            <p className="text-gray-500 mt-2 wrap-break-word">
              Our streamlined process gets you approved in minutes, not days.
            </p>
          </div>
          <div className="shadow-lg w-full sm:w-1/4 sm:min-h-35 max-w-xl bg-white rounded-lg p-6">
            <h2 className="text-gray-700 text-xl font-semibold">Competitive Rates</h2>
            <p className="text-gray-500 mt-2 wrap-break-word">Enjoy some of the lowest interest rates in the market.</p>
          </div>
          <div className="shadow-lg w-full sm:w-1/4 sm:min-h-35 max-w-xl bg-white rounded-lg p-6">
            <h2 className="text-gray-700 text-xl font-semibold">Flexible Terms</h2>
            <p className="text-gray-500 mt-2 wrap-break-word">
              Tailored payment plans that fit your budget and lifestyle.
            </p>
          </div>
        </div>
      </section>
      <section className="bg-gray-50 py-16 px-4 md:py-24">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-blue-500"> Calculate your loan</h1>
            <p className="mt-6 text-lg text-gray-600">
              Calculate the terms of your car loan in advance and be confident in your choice.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Loan Calculator</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Loan Amount:</label>
                <input
                  type="range"
                  min="0"
                  max="100000"
                  step="1000"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="relative flex justify-between text-xs text-gray-500 mt-1 items-center w-full">
                  <span className="absolute left-0">0 $</span>
                  <span className="font-bold mx-auto">{loanAmount}</span>
                  <span className="absolute right-0 ">100 000 $</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Loan Term(Months)</label>
                <input
                  type="range"
                  min="12"
                  max="84"
                  step="12"
                  value={month}
                  onChange={(e) => setMonth(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="relative flex justify-between text-xs text-gray-500 mt-1">
                  <span className="absolute left-0 ">12 mo</span>
                  <span className="font-bold mx-auto">{month}</span>
                  <span className="absolute right-0 ">84 mo</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Interest Rate (APR)</label>
                <select
                  value={apr}
                  onChange={(e) => setApr(Number(e.target.value))}
                  className="w-full bg-white border border-gray-300 text-gray-600  rounded-lg px-3 py-2 focus:outline-none"
                >
                  {aprOptions.map((aprOption) => (
                    <option key={aprOption} value={aprOption}>
                      {aprOption}%
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-xl">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Estimated Monthly Payment:</span>
                  <span className="text-2xl font-bold text-gray-700">${calculateMonthlyPayment()}</span>
                </div>
              </div>

              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition shadow-lg shadow-blue-200">
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
