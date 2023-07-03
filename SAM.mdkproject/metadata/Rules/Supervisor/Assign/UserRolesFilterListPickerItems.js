import libSuper from '../../Supervisor/SupervisorLibrary';

export default function UserRolesFilterListPickerItems(context) {

    let type = libSuper.getSupervisorAssignmentModel(context);
    let filter = '';
    
    if (type && type === 'O') {
        filter = "$filter=OrgId eq '" + libSuper.getSupervisorOrgId() + "'";
    } else {
        filter = "$filter=ExternalWorkCenterId eq '" + libSuper.getSupervisorWorkCenter() + "'";
    }
    return context.read('/SAPAssetManager/Services/AssetManager.service', 'UserRoles', ['SAPUserId','UserNameLong','PersonnelNo'], filter + '&$orderby=SAPUserId,UserNameShort').then(result => {
        var json = [];
        json.push(
            {
                'DisplayValue': context.localizeText('unassigned'),
                'ReturnValue': '00000000',
            });
        result.forEach(function(element) {
            json.push(
                {
                    'DisplayValue': `${element.SAPUserId} - ${element.UserNameLong}`,
                    'ReturnValue': element.PersonnelNo,
                });
        });
        const uniqueSet = new Set(json.map(item => JSON.stringify(item)));
        let finalResult = [...uniqueSet].map(item => JSON.parse(item));
        return finalResult;
    });
}
