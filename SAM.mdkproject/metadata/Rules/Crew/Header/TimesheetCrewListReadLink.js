import libCom from '../../Common/Library/CommonLibrary';

export default function TimesheetCrewListReadLink(context) {

    if (!context) {
        throw new TypeError('Context can\'t be null or undefined');
    }

    return context.read('/SAPAssetManager/Services/AssetManager.service','CrewLists',['CrewId'],"$filter=CrewId eq '" + libCom.getStateVariable(context, 'TimesheetCrewHeaderCrewId') + "'").then(result => {
        return result.getItem(0)['@odata.readLink'];
    });
}
