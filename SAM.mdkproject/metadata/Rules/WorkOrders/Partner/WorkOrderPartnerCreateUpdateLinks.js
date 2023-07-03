import {PartnerLibrary as libPartner} from './WorkOrderPartnerLibrary';

export default function WorkOrderPartnerCreateUpdateLinks(pageProxy) {
    return libPartner.getCreateUpdateLink(pageProxy);
}
