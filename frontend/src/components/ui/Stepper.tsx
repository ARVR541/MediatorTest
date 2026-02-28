import { clsx } from 'clsx';

interface StepperProps {
  steps: string[];
  currentStep: number;
}

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <ol className="grid gap-3 md:grid-cols-5" aria-label="Шаги онлайн-записи">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isDone = stepNumber < currentStep;

        return (
          <li
            key={step}
            className={clsx(
              'rounded-lg border px-3 py-3 text-sm',
              isActive && 'border-accentGold bg-accentGold/10 text-accentDeep',
              isDone && 'border-accentDeep bg-accentDeep text-white',
              !isActive && !isDone && 'border-accentDeep/20 bg-surface text-muted',
            )}
          >
            <span className="mr-2 inline-flex size-6 items-center justify-center rounded-full border border-current text-xs">
              {stepNumber}
            </span>
            {step}
          </li>
        );
      })}
    </ol>
  );
}
