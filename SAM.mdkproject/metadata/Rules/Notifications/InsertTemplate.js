import ValidationLibrary from '../Common/Library/ValidationLibrary';

/**
* Inserts template text into Notes field
* @param {IClientAPI} context
*/
function insert_template(context) {
    context.read('/SAPAssetManager/Services/AssetManager.service', 'LongTextTemplates', [], '$top=1').then(template => {
        if (!ValidationLibrary.evalIsEmpty(template) && template.getItem(0)) {
            setTemplate(context, template.getItem(0).TextString);
        } 
    });
}

function setTemplate(context, templateString) {
    context.getPageProxy().evaluateTargetPath('#Control:LongTextNote').setValue(templateString);
    context.getPageProxy().getClientData().USE_TEMPLATE = true;
}

export default function InsertTemplate(context) {
    if (context.getPageProxy().getClientData().USE_TEMPLATE) {
        context.executeAction({
            'Name': '/SAPAssetManager/Actions/Common/GenericWarningDialog.action',
            'Properties':
            {
                'Title': '$(L,warning)',
                'Message': '$(L,overwrite_note)',
                'OKCaption': '$(L,ok)',
                'CancelCaption': '$(L,cancel)',
            },
        }).then(actionResult => {
            if (actionResult.data === true) {
                insert_template(context);
            }
        });
    } else {
        insert_template(context);
    }
}
