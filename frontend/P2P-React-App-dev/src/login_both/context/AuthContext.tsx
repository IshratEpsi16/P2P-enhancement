// AuthContext.tsx
import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import LoginInterface from "../interface/LoginInterface";
import decodeFromLocalStorage from "../../utils/methods/decodeFromLocalStorage";

interface AuthContextProps {
  loginData?: LoginInterface | null;
  setLoginData: (data: LoginInterface) => void;
  token: string | null;
  setToken: (token: string | null) => void;
  isBuyer: number | null;
  setIsBuyer: (isBuyer: number | null) => void;
  userId: number | null;
  setUserId: (userId: number | null) => void;
  vendorId: number | null;
  setVendorId: (vendorId: number | null) => void;

  buyerId: number | null;
  setBuyerId: (buyerId: number | null) => void;
  isNewUser: number | null;
  setIsNewUser: (isNewUser: number | null) => void;
  regToken: string | null;
  setRegToken: (regToken: string | null) => void;
  submissionStatus: string | null;
  setSubmissionStatus: (submissionStatus: string | null) => void;
  isRegCompelte: string | null;
  setIsRegCompelte: (isRegCompelte: string | null) => void;
  supplierId: number | null; //means supplier id
  setSupplierId: (supplierId: number | null) => void;
  bgId: number | null; //means supplier id
  setBgId: (bgId: number | null) => void;
  supplierCountryCode: string | null;
  setSupplierCountryCode: (supplierCountryCode: string | null) => void;

  department: string | null;
  setDepartment: (department: string | null) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [loginData, setLoginData] = useState<LoginInterface | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isBuyer, setIsBuyer] = useState<number | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [vendorId, setVendorId] = useState<number | null>(null);
  const [isNewUser, setIsNewUser] = useState<number | null>(null);
  const [regToken, setRegToken] = useState<string | null>(null);
  const [department, setDepartment] = useState<string | null>(null);
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);
  const [isRegCompelte, setIsRegCompelte] = useState<string | null>(null);
  const [supplierId, setSupplierId] = useState<number | null>(null);
  const [bgId, setBgId] = useState<number | null>(null);
  const [supplierCountryCode, setSupplierCountryCode] = useState<string | null>(
    null
  );
  const [buyerId, setBuyerId] = useState<number | null>(null);

  // Retrieve token from local storage on mount
  useEffect(() => {
    const countryCode = localStorage.getItem("supplierCountryCode");
    // const storedIsBuyer = localStorage.getItem('isBuyer');
    if (countryCode) {
      setSupplierCountryCode(countryCode);
    }
    // if (storedIsBuyer) {
    //     const parsed = parseInt(storedIsBuyer);
    //     setIsBuyer(parsed);
    // }
  }, []); // empty dependency array ensures it runs only on mount
  // Retrieve token from local storage on mount

  // Retrieve token from local storage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("bgId");
    // const storedIsBuyer = localStorage.getItem('isBuyer');
    if (storedToken) {
      setBgId(Number(storedToken));
    }
    // if (storedIsBuyer) {
    //     const parsed = parseInt(storedIsBuyer);
    //     setIsBuyer(parsed);
    // }
  }, []); // empty dependency array ensures it runs only on mount

  // Retrieve token from local storage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("userId");
    // const storedIsBuyer = localStorage.getItem('isBuyer');
    if (storedToken) {
      setUserId(Number(storedToken));
    }
    // if (storedIsBuyer) {
    //     const parsed = parseInt(storedIsBuyer);
    //     setIsBuyer(parsed);
    // }
  }, []); // empty dependency array ensures it runs only on mount
  // Retrieve token from local storage on mount
  useEffect(() => {
    const storedId = localStorage.getItem("vendorId");
    // const storedIsBuyer = localStorage.getItem('isBuyer');
    if (storedId) {
      setVendorId(Number(storedId));
    }
    // if (storedIsBuyer) {
    //     const parsed = parseInt(storedIsBuyer);
    //     setIsBuyer(parsed);
    // }
  }, []); // empty dependency array ensures it runs only on mount

  // Retrieve token from local storage on mount
  // Retrieve token from local storage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("buyerId");
    // const storedIsBuyer = localStorage.getItem('isBuyer');
    if (storedToken) {
      setBuyerId(Number(storedToken));
    }
    // if (storedIsBuyer) {
    //     const parsed = parseInt(storedIsBuyer);
    //     setIsBuyer(parsed);
    // }
  }, []); // empty dependency array ensures it runs only on mount

  // Retrieve token from local storage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    // const storedIsBuyer = localStorage.getItem('isBuyer');
    if (storedToken) {
      setToken(storedToken);
    }
    // if (storedIsBuyer) {
    //     const parsed = parseInt(storedIsBuyer);
    //     setIsBuyer(parsed);
    // }
  }, []); // empty dependency array ensures it runs only on mount

  // Retrieve token from local storage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("regToken");
    // const storedIsBuyer = localStorage.getItem('isBuyer');
    if (storedToken) {
      setRegToken(storedToken);
    }
    // if (storedIsBuyer) {
    //     const parsed = parseInt(storedIsBuyer);
    //     setIsBuyer(parsed);
    // }
  }, []); // empty dependency array ensures it runs only on mount
  // Retrieve token from local storage on mount
  // Retrieve token from local storage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("department");
    // const storedIsBuyer = localStorage.getItem('isBuyer');
    if (storedToken) {
      setDepartment(storedToken);
    }
    // if (storedIsBuyer) {
    //     const parsed = parseInt(storedIsBuyer);
    //     setIsBuyer(parsed);
    // }
  }, []); // empty dependency array ensures it runs only on mount
  // Retrieve token from local storage on mount
  useEffect(() => {
    const storedSubmissionStatus = localStorage.getItem("submissionStatus");
    // const storedIsBuyer = localStorage.getItem('isBuyer');
    console.log(storedSubmissionStatus);

    if (storedSubmissionStatus) {
      console.log(storedSubmissionStatus);
      setSubmissionStatus(storedSubmissionStatus);
    }
    // if (storedIsBuyer) {
    //     const parsed = parseInt(storedIsBuyer);
    //     setIsBuyer(parsed);
    // }
  }, []); // empty dependency array ensures it runs only on mount
  // Retrieve token from local storage on mount
  useEffect(() => {
    const storedIsRegCompelte = localStorage.getItem("isRegCompelte");
    // const storedIsBuyer = localStorage.getItem('isBuyer');
    if (storedIsRegCompelte) {
      setIsRegCompelte(storedIsRegCompelte);
    }
    // if (storedIsBuyer) {
    //     const parsed = parseInt(storedIsBuyer);
    //     setIsBuyer(parsed);
    // }
  }, []); // empty dependency array ensures it runs only on mount

  // Retrieve isBuyer from local storage on mount
  useEffect(() => {
    const storedIsBuyer = localStorage.getItem("isBuyer");
    // const storedIsBuyer = decodeFromLocalStorage('isBuyer');
    if (storedIsBuyer) {
      setIsBuyer(Number(storedIsBuyer));
    }
  }, []);

  // Save token to local storage whenever it changes
  useEffect(() => {
    if (bgId) {
      localStorage.setItem("bgId", bgId.toString());
      // localStorage.setItem('isBuyer', isBuyer.toString());
    } else {
      localStorage.removeItem("bgId");
      // localStorage.removeItem('isBuyer');
    }
  }, [bgId]);

  // Retrieve isNewUser from local storage on mount

  // Save token to local storage whenever it changes
  useEffect(() => {
    if (userId) {
      localStorage.setItem("userId", userId.toString());
      // localStorage.setItem('isBuyer', isBuyer.toString());
    } else {
      localStorage.removeItem("userId");
      // localStorage.removeItem('isBuyer');
    }
  }, [userId]);

  // Retrieve isNewUser from local storage on mount
  // Save token to local storage whenever it changes
  useEffect(() => {
    if (vendorId) {
      localStorage.setItem("vendorId", vendorId.toString());
      // localStorage.setItem('isBuyer', isBuyer.toString());
    } else {
      localStorage.removeItem("vendorId");
      // localStorage.removeItem('isBuyer');
    }
  }, [vendorId]);

  // Retrieve isNewUser from local storage on mount
  // Save token to local storage whenever it changes
  useEffect(() => {
    if (buyerId) {
      localStorage.setItem("buyerId", buyerId.toString());
      // localStorage.setItem('isBuyer', isBuyer.toString());
    } else {
      localStorage.removeItem("buyerId");
      // localStorage.removeItem('isBuyer');
    }
  }, [buyerId]);

  // Retrieve isNewUser from local storage on mount
  // Save token to local storage whenever it changes
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      // localStorage.setItem('isBuyer', isBuyer.toString());
    } else {
      localStorage.removeItem("token");
      // localStorage.removeItem('isBuyer');
    }
  }, [token]);

  // Retrieve isNewUser from local storage on mount
  // Save token to local storage whenever it changes
  useEffect(() => {
    if (regToken) {
      localStorage.setItem("regToken", regToken);
      // localStorage.setItem('isBuyer', isBuyer.toString());
    } else {
      localStorage.removeItem("regToken");
      // localStorage.removeItem('isBuyer');
    }
  }, [regToken]);

  // Retrieve isNewUser from local storage on mount
  // Save token to local storage whenever it changes
  // Save token to local storage whenever it changes
  useEffect(() => {
    if (department) {
      localStorage.setItem("department", department);
      // localStorage.setItem('isBuyer', isBuyer.toString());
    } else {
      localStorage.removeItem("department");
      // localStorage.removeItem('isBuyer');
    }
  }, [department]);

  // Retrieve isNewUser from local storage on mount
  // Save token to local storage whenever it changes
  useEffect(() => {
    if (submissionStatus) {
      localStorage.setItem("submissionStatus", submissionStatus);
      // localStorage.setItem('isBuyer', isBuyer.toString());
    } else {
      localStorage.removeItem("submissionStatus");
      // localStorage.removeItem('isBuyer');
    }
  }, [submissionStatus]);

  // Retrieve isNewUser from local storage on mount
  // Retrieve isNewUser from local storage on mount
  // Save token to local storage whenever it changes
  useEffect(() => {
    if (isRegCompelte) {
      localStorage.setItem("isRegCompelte", isRegCompelte);
      // localStorage.setItem('isBuyer', isBuyer.toString());
    } else {
      localStorage.removeItem("isRegCompelte");
      // localStorage.removeItem('isBuyer');
    }
  }, [isRegCompelte]);

  // Retrieve isNewUser from local storage on mount

  // useEffect(() => {
  //     const storedIsNewUser = localStorage.getItem('isNewUser');
  //     if (storedIsNewUser) {
  //         setIsBuyer(Number(storedIsNewUser));
  //     }
  // }, []);

  // Save isBuyer to local storage whenever it changes
  useEffect(() => {
    if (isBuyer !== null) {
      localStorage.setItem("isBuyer", String(isBuyer));
    } else {
      localStorage.removeItem("isBuyer");
    }
  }, [isBuyer]);
  // Save isBuyer to local storage whenever it changes
  // useEffect(() => {
  //     if (isNewUser !== null) {
  //         localStorage.setItem('isNewUser', String(isNewUser));
  //     } else {
  //         localStorage.removeItem('isNewUser');
  //     }
  // }, [isNewUser]);

  // Retrieve isNewUser from local storage on mount
  // Save token to local storage whenever it changes
  useEffect(() => {
    if (supplierCountryCode) {
      localStorage.setItem("supplierCountryCode", supplierCountryCode);
      // localStorage.setItem('isBuyer', isBuyer.toString());
    } else {
      localStorage.removeItem("supplierCountryCode");
      // localStorage.removeItem('isBuyer');
    }
  }, [supplierCountryCode]);

  // Retrieve isNewUser from local storage on mount

  return (
    <AuthContext.Provider
      value={{
        loginData,
        setLoginData,
        token,
        setToken,
        isBuyer,
        setIsBuyer,
        userId,
        setUserId,
        vendorId,
        setVendorId,
        isNewUser,
        setIsNewUser,
        regToken,
        setRegToken,
        submissionStatus,
        setSubmissionStatus,
        isRegCompelte,
        setIsRegCompelte,
        supplierId,
        setSupplierId,
        bgId,
        setBgId,
        supplierCountryCode,
        setSupplierCountryCode,
        buyerId,
        setBuyerId,
        department,
        setDepartment,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
