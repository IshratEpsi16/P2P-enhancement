interface NameDescriptionLookup {
  [name: string]: string;
}

// Define the lookup table
export const NotificationLookup: NameDescriptionLookup = {
  // Supplier: "supplier",
  Vat: "VAT",
  SupplierApproval: "Supplier Approval",
  Rfq: "RFQ",
  Title: "applied for vat approval",
  Route_to: "/buyer-home/680",
};

// export default NotificationLookup;

export function getNotificationDescription(name: string): string {
  // Convert name to uppercase for case-insensitive matching
  name = name.toUpperCase();

  // Check if the name exists in the lookup table
  if (name in NotificationLookup) {
    return NotificationLookup[name];
  } else {
    return `nothing found for ${name}`;
  }
}
