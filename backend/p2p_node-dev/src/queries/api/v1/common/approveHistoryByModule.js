
    
    const isEmpty = require("is-empty");
    let historyByModule = async (data) => {
        let query = `
        select 
    us.USER_NAME,
    us.FULL_NAME ,
    ah.*
    from 
    xxp2p.xxp2p_approve_history ah 
    left join xxp2p.xxp2p_user us on us.user_id = ah.CREATED_BY
    where object_id = '${data.OBJECT_ID}'
    and object_type_code = '${data.OBJECT_TYPE_CODE}'
    order by 3 desc
            `;
        return query;
    };
    
    module.exports = {
        historyByModule
    };
    