import libCom from '../../Common/Library/CommonLibrary';
import libForms from './FSMSmartFormsLibrary';


export default function FSMFormsInstanceListViewCaption(context) {

    let queryOption, totalQueryOption = '';
   
    queryOption = libCom.getStateVariable(context,'FORMS_FILTER');
    if (libCom.isDefined(context.binding)) {
        totalQueryOption = libForms.getOperationFSMFormsQueryOptions(context, false);
    } else {
        totalQueryOption = libForms.getFSMFormsQueryOptions(context, false);
    }
    if (!queryOption) {
        if (libCom.isDefined(context.binding)) {
            queryOption = libForms.getOperationFSMFormsQueryOptions(context, false);
        } else {
            queryOption = libForms.getFSMFormsQueryOptions(context, false);
        }
    }

    var params = [];
    let totalCountPromise = context.count('/SAPAssetManager/Services/AssetManager.service','FSMFormInstances', totalQueryOption);
    let countPromise = context.count('/SAPAssetManager/Services/AssetManager.service','FSMFormInstances', queryOption);

    return Promise.all([totalCountPromise, countPromise]).then(function(resultsArray) {
        let totalCount = resultsArray[0];
        let count = resultsArray[1];
        let caption = '';
        
        params.push(count);
        params.push(totalCount);
        
        if (count === totalCount) {
            caption = context.localizeText('smart_forms_x', [totalCount]);
        } else {
            caption = context.localizeText('smart_forms_x_x', params);
        }
        
        return caption;
    }); 
}
