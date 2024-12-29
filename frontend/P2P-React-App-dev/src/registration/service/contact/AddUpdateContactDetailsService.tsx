const AddUpdateContactDetailsService = async (
  token: string,
  id: number | null,
  contactName: string,
  contactEmail: string,
  contactPosition: string,
  contactNumber: string,
  mobileNo: string,
  nidPassportNumber: string,
  isNid: string,
  nidPassportFile: File | null,
  signatureFile: File | null,
  isAgent: string,
  agentName: string,
  agentEmail: string,
  agentregisteredAddress: string,
  agentSince: string,
  agentCOntactPersonname: string,
  agentContactPostion: string,
  agentMobileNo: string,
  agentIrc: string,
  agentBin: string,
  bdPermissionNo: string,
  eTinFile: File | null,
  isReg: string
) => {
  const BASE_URL = process.env.REACT_APP_B;
  const url = `${BASE_URL}supplier-registration/contact/add`;

  console.log(url);

  const formData = new FormData();
  console.log("id", id);
  console.log("contactName", contactName);
  console.log("contactEmail", contactEmail);
  console.log("contactPosition", contactPosition);
  console.log("typecontactPosition", typeof contactPosition);
  console.log("contactNumber", contactNumber);
  console.log("mobileNo", mobileNo);
  console.log("nidPassportNumber", nidPassportNumber);
  console.log("isNid", isNid);
  console.log("nidPassportFile", nidPassportFile);
  console.log("signatureFile", signatureFile);
  console.log("isAgent", isAgent);
  console.log("agentName", agentName);
  console.log("agentEmail", agentEmail);
  console.log("agentregisteredAddress", agentregisteredAddress);
  console.log("agentSince", agentSince);
  console.log("agentCOntactPersonname", agentCOntactPersonname);
  console.log("agentContactPostion", agentContactPostion);
  console.log("agentMobileNo", agentMobileNo);
  console.log("agentIrc", agentIrc);
  console.log("agentBin", agentBin);
  console.log("bdPermissionNo", bdPermissionNo);
  console.log("eTinFile", eTinFile);
  console.log("isRegistration", isReg);

  // console.log(id, contactName, contactEmail, contactPosition, contactNumber, mobileNo, nidPassportNumber, isNid, nidPassportFile, signatureFile, isAgent, agentName, agentEmail, agentregisteredAddress, agentSince, agentCOntactPersonname, agentContactPostion, agentMobileNo, agentIrc, agentBin, bdPermissionNo, eTinFile);

  if (id !== null && id !== undefined) {
    formData.append("id", id.toString());
  }

  if (contactName && contactName !== undefined) {
    formData.append("name", contactName);
  }
  if (contactEmail && contactEmail !== undefined) {
    formData.append("email", contactEmail);
  }
  if (contactPosition && contactPosition !== undefined) {
    formData.append("position", contactPosition);
  }
  if (contactNumber && contactNumber !== undefined) {
    formData.append("mobile_no_1", contactNumber);
  }
  if (mobileNo && mobileNo !== undefined) {
    formData.append("mobile_no_2", mobileNo);
  }
  if (nidPassportNumber && nidPassportNumber !== undefined) {
    formData.append("nid_passport_number", nidPassportNumber);
  }
  if (isNid && isNid !== undefined) {
    formData.append("is_nid", isNid);
  }

  if (nidPassportFile !== null) {
    formData.append("nid_or_passport_file", nidPassportFile);
  }
  if (signatureFile !== null) {
    formData.append("signature_file_path", signatureFile);
  }
  if (isAgent && isAgent !== undefined) {
    formData.append("is_agent", isAgent);
  }
  if (agentName && agentName !== undefined) {
    formData.append("agent_name", agentName);
  }
  if (agentEmail && agentEmail !== undefined) {
    formData.append("agent_email", agentEmail);
  }
  if (agentregisteredAddress && agentregisteredAddress !== undefined) {
    formData.append("agent_registered_address", agentregisteredAddress);
  }
  if (agentSince && agentSince !== undefined) {
    formData.append("agent_since", agentSince);
  }
  if (agentCOntactPersonname && agentCOntactPersonname !== undefined) {
    formData.append("agent_contact_person_name", agentCOntactPersonname);
  }
  if (agentContactPostion && agentContactPostion !== undefined) {
    formData.append("agent_contact_position", agentContactPostion);
  }
  if (agentMobileNo && agentMobileNo !== undefined) {
    formData.append("agent_mobile_no", agentMobileNo);
  }
  if (agentIrc && agentIrc !== undefined) {
    formData.append("agent_irc", agentIrc);
  }
  if (agentBin && agentBin !== undefined) {
    formData.append("agent_bin", agentBin);
  }
  if (bdPermissionNo && bdPermissionNo !== undefined) {
    formData.append("bd_permission_no", bdPermissionNo);
  }

  if (eTinFile !== null) {
    formData.append("etin_file", eTinFile);
  }

  if (isReg && isReg !== undefined) {
    formData.append("active_status", isReg);
  }

  const response = await fetch(url, {
    method: "POST",

    headers: {
      // "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  const data = await response.json();
  return {
    statusCode: response.status,
    data: data,
  };
};
export default AddUpdateContactDetailsService;
