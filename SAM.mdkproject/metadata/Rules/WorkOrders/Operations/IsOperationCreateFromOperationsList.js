import libCommon from '../../Common/Library/CommonLibrary';
export default function IsOperationCreateFromOperationsList(context) {
     //Return true if Operation level assigment type
     return (libCommon.getWorkOrderAssnTypeLevel(context) === 'Operation' && !libCommon.isDefined(context.binding['@odata.readLink']) && libCommon.getStateVariable(context,'FromOperationsList'));
}
