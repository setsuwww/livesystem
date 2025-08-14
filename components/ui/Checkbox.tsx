interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  disabled?: boolean;
  className?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, checked, onChange, error, disabled, className = '' }) => {
  return (
    <div className={`w-full ${className}`}>
      <label className="flex items-center gap-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
        <input type="checkbox" checked={checked} onChange={onChange}
          disabled={disabled}
          className={`h-3.5 w-3.5 text-sky-500 border rounded focus:border-sky-500 transition-all duration-200
            ${disabled ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : 'bg-white dark:bg-gray-800'}
            ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'}
            `}
        />
        <span className="text-gray-900">{label}</span>
      </label>
      {error && (
        <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-5h2v2h-2v-2zm0-8h2v6h-2V5z" clipRule="evenodd"/>
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

export default Checkbox;