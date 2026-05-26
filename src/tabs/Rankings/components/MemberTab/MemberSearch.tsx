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
      className="w-full px-4 py-2 bg-gray-950 border border-gray-800 rounded-lg text-white"
    />
  );
}
