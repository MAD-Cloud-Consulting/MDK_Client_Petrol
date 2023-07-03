import libCom from '../../Common/Library/CommonLibrary';

export default function OnCreategetDocDescription(pageProxy) {

    return libCom.getStateVariable(pageProxy,'DocDescription');

}
