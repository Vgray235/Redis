// import React, { createContext, useContext, useState } from 'react';

// const ToastContext = createContext();

// export const useToast = () => {
//   const context = useContext(ToastContext);
//   if (!context) {
//     throw new Error('useToast must be used within ToastProvider');
//   }
//   return context;
// };

// export const ToastProvider = ({ children }) => {
//   const [toasts, setToasts] = useState([]);

//   const addToast = (message, type = 'info', ttl = 5000) => {
//     const id = Date.now() + Math.random();
//     setToasts((t) => [...t, { id, message, type }]);
//     setTimeout(() => {
//       setToasts((t) => t.filter(x => x.id !== id));
//     }, ttl);
//   };

//   const removeToast = (id) => {
//     setToasts(t => t.filter(x => x.id !== id));
//   };

//   return (
//     <ToastContext.Provider value={{ addToast }}>
//       {children}
//       <div className="toast-wrap">
//         {toasts.map(t => (
//           <div
//             key={t.id}
//             className={`toast toast-${t.type}`}
//             onClick={() => removeToast(t.id)}
//           >
//             {t.message}
//           </div>
//         ))}
//       </div>
//     </ToastContext.Provider>
//   );
// };


// LoginRegister.jsx
import React, { createContext, useContext } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const addToast = (message, type = "info") => {
    switch (type) {
      case "success":
        toast.success(message, { position: "top-right" });
        break;
      case "error":
        toast.error(message, { position: "top-right" });
        break;
      case "warning":
        toast.warning(message, { position: "top-right" });
        break;
      default:
        toast.info(message, { position: "top-right" });
    }
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastContainer autoClose={2500} hideProgressBar={false} />
    </ToastContext.Provider>
  );
};
