import libCommon from '../../Common/Library/CommonLibrary';
export default function IsSubOperationCreateFromOperationsList(context) {
     //Return true if Operation level assigment type
     return (libCommon.getWorkOrderAssnTypeLevel(context) === 'SubOperation' && !libCommon.isDefined(context.binding['@odata.readLink']) && libCommon.getStateVariable(context,'FromSubOperationsList'));
}
