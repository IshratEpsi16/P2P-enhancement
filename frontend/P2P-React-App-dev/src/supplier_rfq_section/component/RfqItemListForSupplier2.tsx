import React, { useState, useRef, useEffect } from "react";
import { useSupplierRfqIdContext } from "../context/SupplierRfqIdContext";
import { useAuth } from "../../login_both/context/AuthContext";

export default function RfqItemListForSupplier2() {
  const { selectedRfq, setSelectedRfq } = useSupplierRfqIdContext();

  const [isAccepted, setIsAccepted] = useState<boolean>(false);

  const { token, userId } = useAuth();

  return <div>RfqItemListForSupplier2</div>;
}
