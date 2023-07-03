/**
 * Retruns UserTimeEntry readlink from state variable
 * @param {*} context
 */
import libCom from '../../Common/Library/CommonLibrary';
export default function UserTimeEntryReadLink(context) {
    return libCom.getStateVariable(context,'ClockReadLink'); 
}
