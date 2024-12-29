// ErrorToast.tsx
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const showErrorToast = (message: string) => {
  toast.error(message, {
    position: toast.POSITION.TOP_CENTER,
    autoClose: 9000,
  });
};

const ErrorToast: React.FC = () => {
  return <ToastContainer />;
};

export default ErrorToast;
