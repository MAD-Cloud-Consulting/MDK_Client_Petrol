import libCrew from '../CrewLibrary';
import userFeaturesLib from '../../UserFeatures/UserFeaturesLibrary';
export default function CrewTimeSheetsTodaysCrewMembers(context) {
    if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Crew.global').getValue())) {
        const crewMembersText = context.localizeText('crew_members');
        let date;
        if (context.binding === undefined) { //The binding object doesn't exist on the Overview page hence, looking for the Date property results in an error.
            date = new Date();
            date.setHours(0,0,0,0);
        } else {
            date = context.binding.Date;
        }
        return libCrew.getTotalCrewMembersWithDate(context, date).then((members) => {
            return members + ' ' + crewMembersText;
        });
    } else {
        return '';
    }
}
