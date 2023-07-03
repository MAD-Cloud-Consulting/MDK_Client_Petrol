import libCom from '../../Common/Library/CommonLibrary';
/**
* Rule which is used to show close icon if the window is opened from search bar
* @param {IClientAPI} context
*/
export default function IsSearchStringAvailable(context) {
    let searchString = libCom.getStateVariable(context, 'SearchStringOnline');
    return libCom.isDefined(searchString);
}
