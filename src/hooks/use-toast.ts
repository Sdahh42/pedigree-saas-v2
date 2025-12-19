/**
 * Hook useToast pour les notifications
 * Gère l'état et les actions des notifications toast
 */

import * as React from 'react';

// Types
export interface Toast {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: 'default' | 'destructive' | 'success';
}

interface ToastState {
  toasts: Toast[];
}

type ToastAction =
  | { type: 'ADD_TOAST'; toast: Toast }
  | { type: 'UPDATE_TOAST'; toast: Partial<Toast> & { id: string } }
  | { type: 'DISMISS_TOAST'; toastId: string }
  | { type: 'REMOVE_TOAST'; toastId: string };

// Constantes
const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 5000;

// Reducer
function toastReducer(state: ToastState, action: ToastAction): ToastState {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case 'UPDATE_TOAST':
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    case 'DISMISS_TOAST':
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };

    case 'REMOVE_TOAST':
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };

    default:
      return state;
  }
}

// Store global pour les listeners
const listeners: Array<(state: ToastState) => void> = [];
let memoryState: ToastState = { toasts: [] };

function dispatch(action: ToastAction) {
  memoryState = toastReducer(memoryState, action);
  listeners.forEach((listener) => listener(memoryState));
}

// Générer un ID unique
let count = 0;
function genId() {
  count = (count + 1) % Number.MAX_VALUE;
  return count.toString();
}

// Fonction toast
interface ToastOptions {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: 'default' | 'destructive' | 'success';
  duration?: number;
}

function toast(options: ToastOptions) {
  const id = genId();
  const duration = options.duration ?? TOAST_REMOVE_DELAY;

  dispatch({
    type: 'ADD_TOAST',
    toast: {
      id,
      ...options,
    },
  });

  // Auto-dismiss après la durée
  if (duration > 0) {
    setTimeout(() => {
      dispatch({ type: 'DISMISS_TOAST', toastId: id });
    }, duration);
  }

  return {
    id,
    dismiss: () => dispatch({ type: 'DISMISS_TOAST', toastId: id }),
    update: (props: ToastOptions) =>
      dispatch({ type: 'UPDATE_TOAST', toast: { id, ...props } }),
  };
}

/**
 * Hook useToast
 * Retourne l'état des toasts et les fonctions pour les gérer
 */
function useToast() {
  const [state, setState] = React.useState<ToastState>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);

  return {
    ...state,
    toast,
    dismiss: (toastId: string) => dispatch({ type: 'DISMISS_TOAST', toastId }),
  };
}

export { useToast, toast };
