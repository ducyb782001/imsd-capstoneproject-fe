function PrimaryTextArea({
  title = "",
  note = null,
  className = "",
  classNameTextArea = "",
  placeholder = "",
  onChange = null,
  value = "",
  id = "",
  ...props
}) {
  return (
    <div className={`form-group ${className}`}>
      {title && <p className="mb-2 text-sm text-white">{title}</p>}
      {note && <div className="mb-2 text-sm font-light text-gray">{note}</div>}
      <textarea
        {...props}
        onChange={onChange}
        className={`w-full h-full bg-subBg rounded-lg border text-sm px-4 py-3 smooth-transform outline-none  border-gray text-black focus:border-primary hover:border-primary smooth-transform ${classNameTextArea}`}
        // name="input-requirement"
        id={id}
        cols={30}
        rows={10}
        placeholder={placeholder}
        value={value}
      ></textarea>
      <span className="form-message"></span>
    </div>
  )
}

export default PrimaryTextArea
