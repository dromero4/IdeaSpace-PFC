export function Input({ name, text, type, placeholder, children, value, onChange }) {
    return (
        <>
            <label htmlFor={name}>{text}</label>
            <div className="flex flex-row items-center gap-2">
                <input
                    type={type}
                    name={name}
                    placeholder={placeholder}
                    className="w-50 bg-white focus:bg-gray-100 border-1 rounded-md p-1"
                    value={value}
                    onChange={onChange}
                />
                {children}  {/* Esto permite pasar el EyeClosed o cualquier otro componente */}
            </div>
        </>
    );
}
