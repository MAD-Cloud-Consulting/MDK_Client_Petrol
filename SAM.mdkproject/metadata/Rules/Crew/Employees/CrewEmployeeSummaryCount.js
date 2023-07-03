import libCrew from '../CrewLibrary';

export default function CrewEmployeeSummaryCount(context) {
    return context.count('/SAPAssetManager/Services/AssetManager.service', 'CrewListItems', libCrew.buildCrewListItemsQueryForEmployee(context));
}
