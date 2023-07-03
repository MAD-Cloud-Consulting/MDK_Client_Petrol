import { PartnerFunction } from '../../Common/Library/PartnerFunction';
import libSuper from '../SupervisorLibrary';

/**
 * Return the user name assigned to this work order
 * @param {*} context 
 */
export default function WorkOrderAssignedTo(context, fromList=false) {

    if (!libSuper.isSupervisorFeatureEnabled(context)) { //Only display if supervisor is enabled
        return Promise.resolve('-');
    }

    let binding = context.binding;
    let person = '';
    let count = 0;
    let personList = '';    
 
    if (binding.WOPartners) { //Loop over partner records and concat the assignment rows
        for (let i = 0; i < binding.WOPartners.length; i++) {
            let row = binding.WOPartners[i];
            if (row.PartnerFunction === PartnerFunction.getPersonnelPartnerFunction()) {
                person = context.localizeText('unassigned');
                if (row.Employee_Nav) {
                    person = row.Employee_Nav.EmployeeName;
                }
                if (person !== context.localizeText('unassigned')) {
                    count++;
                    if ((fromList && count < 3) || !fromList) { //Only show 2 people on WO list, show all people on details
                        personList += ', ' + person;
                    }
                }
            }
        }
    }
    if (count === 0) {
        personList = context.localizeText('unassigned');
    } else {
        personList = personList.substring(2); //Remove the leading comma + space
    }
    if (fromList && count > 2) { //Format for list if more than 2 people (one, two +3 others)
        let other;
        if (count === 3) {
            other = context.localizeText('other');
        } else {
            other = context.localizeText('others');
        }
        personList += ' +' + (count - 2) + ' ' + other;
    }
    return Promise.resolve(personList);
}
