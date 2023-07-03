import libCom from '../Common/Library/CommonLibrary';

 export default function PhaseModelFilterPickerReset(context, control) {
    let phaseFilter = libCom.getStateVariable(context, control);
    if (phaseFilter) {
        libCom.removeStateVariable(context, control);
    }
}
