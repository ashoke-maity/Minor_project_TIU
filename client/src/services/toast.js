import { toast } from 'react-toastify';

const defaultOptions = {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

export const Toast = {
  success: (message, options = {}) => {
    toast.success(message, { ...defaultOptions, ...options });
  },
  
  error: (message, options = {}) => {
    toast.error(message, { ...defaultOptions, ...options });
  },
  
  warning: (message, options = {}) => {
    toast.warning(message, { ...defaultOptions, ...options });
  },
  
  info: (message, options = {}) => {
    toast.info(message, { ...defaultOptions, ...options });
  },
  
  promise: (promise, { pending, success, error }, options = {}) => {
    return toast.promise(promise, {
      pending,
      success,
      error,
    }, { ...defaultOptions, ...options });
  }
};

export default Toast; 