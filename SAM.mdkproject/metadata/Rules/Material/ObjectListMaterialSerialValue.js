import libCom from '../Common/Library/CommonLibrary';

/**
 * Returns the material serial number if one exists.
 * This function is called from ObjectDetailsView.page and ObjectListMaterialDetails.page.
 * @param {*} sectionProxy Its binding object should be the material or notification entityset object. Its parent, PageProxy, should contain the MyWorkOrderObjectLists entityset object.
 */
export default function ObjectListMaterialSerialValue(sectionProxy) {
    let woObjectList = sectionProxy.getPageProxy().binding;
    let material = sectionProxy.binding;
    let materialSerial = '';
    let prefix = '';

    if (libCom.getPageName(sectionProxy) === 'ObjectDetailsViewPage') {
        prefix = '$(L, serial): ';
    }

    //When called from ObjectDetailsView.page, woObjectList === MyWorkOrderObjectList. 
    if (woObjectList['@odata.type'] === '#sap_mobile.MyWorkOrderObjectList') {
        if (woObjectList.SerialNum) {
            materialSerial = prefix + woObjectList.SerialNum;
        }
    } else if (material['@odata.type'] === '#sap_mobile.Material') {
        //When called from ObjectListMaterialDetails.page, material === Material.
        if (material.WOObjectList_Nav[0]) {
            if (material.WOObjectList_Nav[0].SerialNum) {
                materialSerial = prefix + material.WOObjectList_Nav[0].SerialNum;
            } else {
                materialSerial = '-';
            }
        }
    } 

    if ((!materialSerial) && material['@odata.type'] === '#sap_mobile.MyNotificationHeader') {
        if (material.Equipment && material.Equipment.SerialNumber) {
            materialSerial = prefix + material.Equipment.SerialNumber.SerialNumber;
        } else {
            materialSerial = '-';
        }
    }

    return materialSerial;

}
