import libCrew from '../CrewLibrary';
import userFeaturesLib from '../../UserFeatures/UserFeaturesLibrary';
export default function CrewTimeSheetsPreviousDayCrewMembers(context) {
    if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Crew.global').getValue())) {
        const crewMembersText = context.localizeText('crew_members');
        let date = new Date();
        date.setDate(date.getDate() - 1);
        return libCrew.getTotalCrewMembersWithDate(context,date).then((members) => {
            return members + ' ' + crewMembersText;
        });
    } else {
        return '';
    }
}
