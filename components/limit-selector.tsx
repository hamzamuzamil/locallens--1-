"use client"

interface LimitSelectorProps {
  value: number
  onChange: (limit: number) => void
}

export default function LimitSelector({ value, onChange }: LimitSelectorProps) {
  return (
    <div className="flex items-center space-x-3">
      <label htmlFor="limit" className="text-sm font-medium text-slate-600 whitespace-nowrap">
        Show:
      </label>
      <select
        id="limit"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-blue-500 transition-colors bg-white"
      >
        <option value={5}>5 results</option>
        <option value={10}>10 results</option>
        <option value={15}>15 results</option>
        <option value={20}>20 results</option>
      </select>
    </div>
  )
}
