import {BusinessPartnerWrapper} from '../../BusinessPartners/BusinessPartnerWrapper';
import {ValueIfExists} from '../../Common/Library/Formatter';

export default function CrewEmployeePhone(context) {
    let entity = {
        'PartnerFunction_Nav': {
            'PartnerType': 'PE',
        },
        'Employee_Nav': context.binding.Employee,
    };
    let wrapper = new BusinessPartnerWrapper(entity);
    let phone = wrapper.communicationProperty('Telephone');
    return ValueIfExists(phone);
}
