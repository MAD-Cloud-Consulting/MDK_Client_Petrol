/** 
 * Clear the state variables
 * 
 * */
import libCommon from '../../Common/Library/CommonLibrary';
export default function CharacteristicCleanUp(pageProxy) {
    libCommon.setStateVariable(pageProxy,'CharValCountIndex', 0);
    libCommon.setStateVariable(pageProxy,'HighestCounter', 0);
    libCommon.setStateVariable(pageProxy,'ClassCharValues', 0);
    libCommon.setStateVariable(pageProxy,'MultiListPicker', false);
    libCommon.setStateVariable(pageProxy,'ListPicker', false);
    libCommon.setStateVariable(pageProxy,'ExistingCounters', []);
    libCommon.clearFromClientData(pageProxy, ['VisibleControlFrom','ListPicker', 'MultiListPicker', 'MultiListPickerCurrentIndex', 'ListPickerLoopIndex', 'CharValCountIndex', 'ClassCharValues', 'ListPickerDeleteIndex','isDeleting', 'CurrentLocalReadLink']);
}
