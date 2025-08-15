import React from "react"

interface ToastProps {
  toast: string | null
}
const Toast: React.FC<ToastProps> = ({ toast }) =>
  !toast ? null : (
    <div className="fixed top-3 right-3 z-40 bg-primary text-primary-foreground px-4 py-2 rounded shadow transition-all animate-in fade-in">
      {toast}
    </div>
  )

export default Toast
