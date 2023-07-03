import libCommon from '../../Common/Library/CommonLibrary';
import RemoveCreatedExpenses from './RemoveCreatedExpenses';

export default function RemoveChanges(context) { 
    return RemoveCreatedExpenses(context).then(()=>{
        libCommon.setStateVariable(context, 'expenses', []);
        return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action');
    });
}
