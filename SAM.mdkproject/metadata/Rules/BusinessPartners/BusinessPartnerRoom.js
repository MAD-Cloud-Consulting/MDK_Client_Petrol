import {BusinessPartnerWrapper} from './BusinessPartnerWrapper';

export default function BusinessPartnerRoom(context) {
    let wrapper = new BusinessPartnerWrapper(context.getBindingObject());
    let room = wrapper.addressProperty('Room');
    return room === undefined ? '' : room;
}
