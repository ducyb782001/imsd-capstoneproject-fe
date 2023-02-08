function PrimaryInput({
  title = null,
  className = "",
  placeholder = "",
  type = "",
  onChange = null,
  classNameInput = "",
  id = "",
  message = "",
  note = "",
  accessoriesLeft = null,
  accessoriesRight = null,
  value = undefined,
  disabled = false,
  ...props
}) {
  return (
    <div className={`${className}`}>
      {title && <div className="mb-2 text-sm font-bold text-black">{title}</div>}
      {note && <p className="mb-2 text-sm text-gray">{note}</p>}
      <div className="relative w-full">
        {accessoriesLeft && (
          <div className="absolute top-3 left-4">{accessoriesLeft}</div>
        )}

        <input
          id={id}
          placeholder={placeholder}
          {...props}
          autoFocus={false}
          type={type}
          onChange={onChange}
          value={value}
          disabled={disabled}
          className={`w-full text-sm py-3 rounded-md outline-none px-4 bg-transparent text-black border border-gray focus:border-primary hover:border-primary smooth-transform ${
            accessoriesLeft && "pl-11"
          } ${accessoriesRight && "pr-11"}
            ${classNameInput}`}
        />
        <span className="form-message">{message}</span>
        {accessoriesRight && (
          <div className="absolute cursor-pointer top-3 right-4">
            {accessoriesRight}
          </div>
        )}
      </div>
    </div>
  )
}

export default PrimaryInput
