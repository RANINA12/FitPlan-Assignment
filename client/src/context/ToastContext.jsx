import { createContext, useContext, useState } from "react";
import Toast from "../components/Toast/Toastify";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState({ message: "", type: "", visible: false });

    const showToast = (message, type = "error") => {
        setToast({ message, type, visible: true });

        setTimeout(() => {
            setToast({ message: "", type: "", visible: false });
        }, 3000);
    };


    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {toast.visible && <Toast message={toast.message} type={toast.type} />}
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);

export default ToastProvider;
