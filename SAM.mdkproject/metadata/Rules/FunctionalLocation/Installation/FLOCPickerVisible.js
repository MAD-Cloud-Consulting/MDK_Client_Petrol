export default function FLOCPickerVisible(context) {

    if (context.binding['@odata.type'] === '#sap_mobile.MyFunctionalLocation') {
        return false;
    } 
    return true;
}
