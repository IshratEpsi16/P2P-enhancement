// ErrorToast.tsx
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const showSuccessToast = (message: string) => {
  toast.success(message, {
    position: toast.POSITION.TOP_CENTER,
    autoClose: 2000,
  });
};

const SuccessToast: React.FC = () => {
  return <ToastContainer />;
};

export default SuccessToast;
