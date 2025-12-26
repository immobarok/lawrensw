export default function Button({ children, className = "", ...props }) {
  return (
    <button
      className={`
         rounded-[8px]  text-lg cursor-pointer
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
