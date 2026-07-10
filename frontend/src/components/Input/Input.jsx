import "./Input.css";

function Input({
  label,
  id,
  type = "text",
  placeholder,
  required = false,
  value,
  onChange,
  disabled = false,
  className = "",
  ...props
}) {
  return (
    <div className="input-container">
      <label htmlFor={id} className="input-label">
        {label}{" "}
        {required && (
          <span aria-hidden="true" className="required-asterisk">
            *
          </span>
        )}
      </label>

      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        required={required}
        aria-required={required}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`input-field ${className}`.trim()}
        {...props}
      />
    </div>
  );
}

export default Input;