import { ActionDetails } from "components/index";
import { useOpenedSteps, useStepDetails } from "store/steps/hooks";

function StepItem({ step }: { step: string }) {
  const { activeStep, errorStep, content, onClose, title } = useStepDetails(step);

  return (
    <ActionDetails
      title={title}
      open={true}
      activeStep={activeStep}
      errorStep={errorStep}
      content={content}
      onClose={onClose}
    />
  );
}

export default function GlobalSteps() {
  const openedSteps = useOpenedSteps();

  return (
    <>
      {openedSteps.map((step) => (
        <StepItem key={step} step={step} />
      ))}
    </>
  );
}
