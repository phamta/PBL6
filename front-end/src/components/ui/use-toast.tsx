import { useState } from 'react'

interface Toast {
  id: string
  title: string
  description?: string
  variant?: 'default' | 'destructive'
}

interface ToastProps {
  title: string
  description?: string
  variant?: 'default' | 'destructive'
}

let toastCount = 0

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = ({ title, description, variant = 'default' }: ToastProps) => {
    const id = (++toastCount).toString()
    const newToast: Toast = { id, title, description, variant }
    
    setToasts((prev) => [...prev, newToast])
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, 5000)
  }

  const dismiss = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  return { toast, toasts, dismiss }
}

// Simple toast function for direct use
export const toast = ({ title, description, variant = 'default' }: ToastProps) => {
  // For now, just use console.log or alert
  // In a real app, you'd integrate with a toast library like react-hot-toast
  if (variant === 'destructive') {
    console.error(`Error: ${title}`, description)
    alert(`Error: ${title}\n${description}`)
  } else {
    console.log(`Success: ${title}`, description)
    alert(`Success: ${title}\n${description}`)
  }
}
