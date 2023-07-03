import { TimeSheetEventLibrary as libTSEvent} from '../../TimeSheetLibrary';
import libCom from '../../../Common/Library/CommonLibrary';
import libVal from '../../../Common/Library/ValidationLibrary';
import userFeaturesLib from '../../../UserFeatures/UserFeaturesLibrary';

export default function TimeSheetEntryCreateUpdateOnPageLoad(context) {
    libTSEvent.TimeSheetEntryCreateUpdateOnPageLoad(context);
    if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Crew.global').getValue())) {
        let pageProxy = context;
        if (typeof pageProxy.getPageProxy === 'function') { 
            pageProxy = context.getPageProxy();
        }
        let actionContext = pageProxy.getActionBinding();
        if (libVal.evalIsEmpty(actionContext)) {
            actionContext = context.binding;
        }
        let personnelNumber = '';
        if (!libVal.evalIsEmpty(actionContext) && actionContext.hasOwnProperty('TimeSheetEmployee')) {
            personnelNumber = actionContext.TimeSheetEmployee;
        }
        if (!libVal.evalIsEmpty(personnelNumber)) {
            let listPicker = context.getControl('FormCellContainer').getControl('MemberLstPkr');
            listPicker.setValue(personnelNumber);
            libCom.setFormcellNonEditable(listPicker);
        }

    }
    libCom.saveInitialValues(context);
}
