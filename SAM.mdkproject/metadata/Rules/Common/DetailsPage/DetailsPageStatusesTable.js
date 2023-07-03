import commonLib from '../Library/CommonLibrary';

export default function DetailsPageStatusesTable(context) {
    const entityType = commonLib.getEntitySetName(context);
    let statusObject;

    switch (entityType) {
        case 'MyWorkOrderHeaders':
            statusObject = context.binding.OrderMobileStatus_Nav;
            break;
        case 'MyWorkOrderOperations':
            statusObject = context.binding.OperationMobileStatus_Nav;
            break;
        case 'MyNotificationHeaders':
            statusObject = context.binding.NotifMobileStatus_Nav;
            break;
        default:
            break;
    }

    if (commonLib.isDefined(statusObject)) {
        let statusProfile = statusObject.StatusProfile;
        let userStatusesPromise = readStatuses(context, 'UserStatuses', `$filter=StatusProfile eq '${statusProfile}' and (${getStatusesQueryString(statusObject.UserStatusCode, 'UserStatus')})`);
        let systemStatusesPromise = readStatuses(context, 'SystemStatuses', `$filter=${getStatusesQueryString(statusObject.SystemStatusCode, 'SystemStatus')}`);

        return Promise.all([userStatusesPromise, systemStatusesPromise]).then(results => {
            return {
                UserStatusText: results[0].join(', ') || '-',
                SystemStatusText: results[1].join(', ') || '-',
            };
        });
    }

    return Promise.resolve([]);
}

function readStatuses(context, entity, queryString) {
    return context.read('/SAPAssetManager/Services/AssetManager.service', entity, [], queryString).then(results => {
        let values = [];
        for (var i = 0; i < results.length; i++) {
            values.push(results.getItem(i).StatusText);
        }
        return values;
    });
}

function getStatusesQueryString(codesString, param) {
    let codes = codesString.split(' ');
    return codes.map(code => `${param} eq '${code}'`).join(' or ');
}
