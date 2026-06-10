type Props = {
  isSubmitting: boolean;
  loadingText?: string;
  text?: string;
  size?: number;
};

export default function SubmitText({
  isSubmitting,
  loadingText = "Submitting...",
  text = "Submit",
  size = 16,
}: Props) {
  if (!isSubmitting) {
    return <>{text}</>;
  }

  return (
    <span className="inline-flex items-center gap-2">
      <svg
        className="animate-spin"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
          opacity="0.25"
        />
        <path
          d="M22 12a10 10 0 0 1-10 10"
          stroke="currentColor"
          strokeWidth="4"
        />
      </svg>
      {loadingText}
    </span>
  );
}
