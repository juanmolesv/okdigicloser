'use client';

interface StepIndicatorProps {
  currentStep: 1 | 2 | 3;
}

const steps = [
  { number: 1, label: 'Registro' },
  { number: 2, label: 'Configura' },
  { number: 3, label: 'Despliega' },
];

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center w-full max-w-lg mx-auto py-8">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          {/* Step circle */}
          <div className="flex flex-col items-center">
            <div
              className={`
                flex items-center justify-center w-10 h-10 rounded-full border-2 text-sm font-semibold transition-all duration-300
                ${
                  step.number < currentStep
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : step.number === currentStep
                      ? 'bg-blue-600 border-blue-600 text-white ring-4 ring-blue-600/30'
                      : 'bg-slate-800 border-slate-600 text-slate-400'
                }
              `}
            >
              {step.number < currentStep ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                step.number
              )}
            </div>
            <span
              className={`
                mt-2 text-xs font-medium
                ${
                  step.number <= currentStep
                    ? 'text-blue-400'
                    : 'text-slate-500'
                }
              `}
            >
              {step.label}
            </span>
          </div>

          {/* Connecting line */}
          {index < steps.length - 1 && (
            <div
              className={`
                w-20 h-0.5 mx-2 mb-6 transition-all duration-300
                ${
                  step.number < currentStep
                    ? 'bg-blue-600'
                    : 'bg-slate-700'
                }
              `}
            />
          )}
        </div>
      ))}
    </div>
  );
}
