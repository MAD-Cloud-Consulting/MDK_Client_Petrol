import libCom from '../../Common/Library/CommonLibrary';
/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function DocumentCreateBDSOnLoaded(context) {
    libCom.saveInitialValues(context);
}
