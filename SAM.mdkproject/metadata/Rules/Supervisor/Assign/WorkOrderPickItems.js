import libVal from '../../Common/Library/ValidationLibrary';

export default function WorkOrderPickerItems(context) {
    let filter = '';

    try {
        let partnerFunction = 'VW';
        let clientData = context.evaluateTargetPathForAPI('#Page:WorkOrderDetailsPage').getClientData();
        if (!libVal.evalIsEmpty(clientData) && clientData.hasOwnProperty('IsUnAssign') && clientData.IsUnAssign) {
            filter = `$filter=OrderId eq '${context.binding.OrderId}'`;
        } else if (!libVal.evalIsEmpty(clientData) && clientData.hasOwnProperty('IsAssign') && clientData.IsAssign) {
            filter = `$filter=WOPartners/all(vw:vw/PartnerFunction ne '${partnerFunction}')&$expand=WOPartners&$orderby=OrderId`;
        } else if (!libVal.evalIsEmpty(clientData) && clientData.hasOwnProperty('IsReAssign') && clientData.IsReAssign) {
            filter = `$filter=OrderId eq '${context.binding.OrderId}'`;
        }
        filter = `$filter=WOPartners/all(vw:vw/PartnerFunction ne '${partnerFunction}')&$expand=WOPartners&$orderby=OrderId`;
    } catch (error) {
        let partnerType = 'VW';
        filter = `$filter=WOPartners/all(vw:vw/PartnerFunction ne '${partnerType}')&$expand=WOPartners&$orderby=OrderId`;
    }

    return context.read('/SAPAssetManager/Services/AssetManager.service', 'MyWorkOrderHeaders', ['OrderId','OrderDescription','OrderType','DueDate'], filter).then(result => {
        var json = [];
        
        result.forEach(function(element) {
            json.push(
                {
                    'ObjectCell':
                    {
                        'PreserveIconStackSpacing': false,
                        'Title' :  `${element.OrderDescription}`,
                        'Subhead' : `${element.OrderId} - ${element.OrderType}`,
                        'Footnote' : libVal.evalIsEmpty(element.DueDate)?context.localizeText('no_due_date'):context.formatDate(element.DueDate),
                    },
                    'ReturnValue': element.OrderId,
                });
        });
        const uniqueSet = new Set(json.map(item => JSON.stringify(item)));
        let finalResult = [...uniqueSet].map(item => JSON.parse(item));
        return finalResult;
    });
}
