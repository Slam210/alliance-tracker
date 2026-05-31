type Props = {
  value: string;
  onChange: (v: string) => void;
};

export function MemberSearch({ value, onChange }: Props) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search members..."
      className="
            w-full
            rounded-xl
            border border-gray-800
            bg-gray-950/80
            px-4 py-2.5 pr-10
            text-sm text-white
            placeholder:text-gray-500
            shadow-sm
            outline-none
            transition-all
            duration-200

            focus:border-blue-500/60
            focus:ring-2
            focus:ring-blue-500/20
            focus:bg-gray-950

            hover:border-gray-700
          "
    />
  );
}
