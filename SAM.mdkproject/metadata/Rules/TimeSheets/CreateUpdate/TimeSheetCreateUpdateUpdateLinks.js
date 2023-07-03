import libCom from '../../Common/Library/CommonLibrary';

export default function TimeSheetCreateUpdateUpdateLinks(pageProxy) {

    var links = [];
    let woReadLink = libCom.getListPickerValue(libCom.getTargetPathValue(pageProxy, '#Control:RecOrderLstPkr/#Value'));
    let opReadLink = libCom.getListPickerValue(libCom.getTargetPathValue(pageProxy, '#Control:OperationLstPkr/#Value'));
    var subOpReadLink = libCom.getListPickerValue(libCom.getTargetPathValue(pageProxy, '#Control:SubOperationLstPkr/#Value'));

    if (woReadLink && opReadLink) {
        links = [
            {
                'Property': 'MyWOHeader',
                'Target':
                {
                    'EntitySet': 'MyWorkOrderHeaders',
                    'ReadLink': woReadLink,
                },
            },
            {
                'Property': 'MyWOOperation',
                'Target':
                {
                    'EntitySet': 'MyWorkOrderOperations',
                    'ReadLink': opReadLink,
                },
            }];
    
        if (subOpReadLink) {
            links.push({
                'Property': 'MyWOSubOperation',
                'Target':
                {
                    'EntitySet': 'MyWorkOrderSubOperations',
                    'ReadLink': subOpReadLink,
                },
            });
        }
    }

    return links;
}
