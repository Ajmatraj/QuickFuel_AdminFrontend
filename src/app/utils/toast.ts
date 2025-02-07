import { toast, ToastPosition } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Default Toast Settings
export const showToast = (message: string, type: string = "default") => {
  const options = {
    position: "top-right" as ToastPosition,
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  switch (type) {
    case "success":
      toast.success(message, options);
      break;
    case "error":
      toast.error(message, options);
      break;
    case "info":
      toast.info(message, options);
      break;
    case "warning":
      toast.warning(message, options);
      break;
    default:
      toast(message, options);
  }
};
