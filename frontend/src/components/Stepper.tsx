type StepperProps = {
  steps: string[];
};

export function Stepper({ steps }: StepperProps) {
  return (
    <div className="stepper">
      {steps.map((step) => (
        <div className="step" key={step}>{step}</div>
      ))}
    </div>
  );
}
