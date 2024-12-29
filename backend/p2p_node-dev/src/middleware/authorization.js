const commonObject = require("../common/api/v1/common");
const getUserRolePermission = require("../routes/api/v1/authentication/authorization_role_permission");

const userRoleAuthorization = async (req, res, next) => {
  if (req.userRoles && req.userRoles.length > 0) {
    for (let i = 0; i < req.userRoles.length; i++) {
      if (
        req.userRoles[i].ROLE_NAME === "Buyer" ||
        req.userRoles[i].ROLE_NAME === "Admin"
      ) {
        return next();
      }
    }

    let value = {
      message: `You are not authorized`,
      status: 401,
    };
    return res.status(value.status).json(value);
  } else if (req.userRoles.length == 0) {
    let value = {
      message: `You do not have any roles!`,
      status: 401,
    };
    return res.status(value.status).json(value);
  } else {
    let value = {
      message: `You are not authorized`,
      status: 401,
    };
    return res.status(value.status).json(value);
  }
};

//(req, res, next) => userPermissionAuthorization(["ViewRFQ"], req, res, next)
// const userPermissionAuthorization = async (
//   permissions = [],
//   req,
//   res,
//   next
// ) => {
//   let userRoles = await getUserRolePermission.getUserRoles(req);
//   let userPermission = await getUserRolePermission.getUserPermission(req);
//   console.log(permissions);

//   if (userRoles && userRoles.length > 0 && userPermission.length > 0) {
//     for (let i = 0; i < userRoles.length; i++) {
//       if (
//         userRoles[i].ROLE_NAME === "Buyer" ||
//         userRoles[i].ROLE_NAME === "Admin"
//       ) {
//         for (let j = 0; j < userPermission.length; j++) {
//           if (permissions.includes(userPermission[j].PERMISSION_NAME)) {
//             return next();
//           }
//         }

//         let value = {
//           message: `You are not authorized for this action.`,
//           status: 401,
//         };
//         return res.status(200).json(value);
//       }
//     }

//     let value = {
//       message: `You are not authorized`,
//       status: 401,
//     };
//     return res.status(200).json(value);
//   } else {
//     let value = {
//       message: `You are not authorized`,
//       status: 401,
//     };
//     return res.status(200).json(value);
//   }
// };
const permissionsLookup = [
  { PERMISSION_NAME: "ViewRFQ", P_DESCRIPTION: "View RFQ" },
  { PERMISSION_NAME: "BuyerSearch", P_DESCRIPTION: "Buyer Name Search in RFQ" },
  { PERMISSION_NAME: "CreateRFQ", P_DESCRIPTION: "Create Or Update RFQ" },
  { PERMISSION_NAME: "ApproveCS", P_DESCRIPTION: "Approve CS" },
  { PERMISSION_NAME: "SupMaintenanceMode", P_DESCRIPTION: "Supplier Maintenance Mode Change." },
  { PERMISSION_NAME: "EmpOUAccess", P_DESCRIPTION: "Employee Operating Unit Permission" },
  { PERMISSION_NAME: "ShipmentGateRcv", P_DESCRIPTION: "Shipment Gate Receiver Permission" },
  { PERMISSION_NAME: "AllRFQView", P_DESCRIPTION: "Permission To View All RFQ" },
];




const userPermissionAuthorization = (requiredPermissions = []) => {
  return async (req, res, next) => {
    console.log(req.userPermission);

    if (
      req.userRoles &&
      req.userRoles.length > 0 &&
      req.userPermission &&
      req.userPermission.length > 0
    ) {
      for (let i = 0; i < req.userRoles.length; i++) {
        if (
          req.userRoles[i].ROLE_NAME === "Buyer" ||
          req.userRoles[i].ROLE_NAME === "Admin"
        ) {
          let missingPermissions = [];

          for (let k = 0; k < requiredPermissions.length; k++) {
            let hasPermission = req.userPermission.some(
              (up) => up.PERMISSION_NAME === requiredPermissions[k]
            );
            if (!hasPermission) {
              missingPermissions.push(requiredPermissions[k]);
            }
          }

          if (missingPermissions.length === 0) {
            return next();
          }

          let missingPermissionDescriptions = missingPermissions
            .map((mp) => {
              let permission = permissionsLookup.find(
                (p) => p.PERMISSION_NAME === mp
              );
              return permission ? permission.P_DESCRIPTION : mp;
            })
            .join(", ");

          let value = {
            message: `You do not have permission for ${missingPermissionDescriptions}`,
            status: 401,
          };
          return res.status(200).json(value);
        }
      }

      let value = {
        message: "You are not authorized",
        status: 401,
      };
      return res.status(200).json(value);
    } else {
      let value = {
        message: "You are not authorized",
        status: 401,
      };
      return res.status(200).json(value);
    }
  };
};

// Example usage:
// const permissions = ['CreateRFQ'];

// Example usage:
// permissions = ['CreateRFQ']

const supplierPermissionAuthorization = (permissions = []) => {
  return async (req, res, next) => {
    // let userRoles = await getUserRolePermission.getUserRoles(req);
    // let userPermission = await getUserRolePermission.getUserPermission(req);
    if (
      req.userRoles &&
      req.userRoles.length > 0 &&
      req.userPermission.length > 0
    ) {
      for (let i = 0; i < req.userRoles.length; i++) {
        if (req.userRoles[i].ROLE_NAME === "Supplier") {
          for (let j = 0; j < req.userPermission.length; j++) {
            if (permissions.includes(req.userPermission[j].PERMISSION_NAME)) {
              return next();
            }
          }

          let value = {
            message: `You are not authorized for this action.`,
            status: 401,
          };
          return res.status(200).json(value);
        }
      }

      let value = {
        message: `You are not authorized`,
        status: 401,
      };
      return res.status(200).json(value);
    } else {
      let value = {
        message: `You are not authorized`,
        status: 401,
      };
      return res.status(200).json(value);
    }
  };
};

module.exports = {
  userRoleAuthorization,
  userPermissionAuthorization,
  supplierPermissionAuthorization,
};
