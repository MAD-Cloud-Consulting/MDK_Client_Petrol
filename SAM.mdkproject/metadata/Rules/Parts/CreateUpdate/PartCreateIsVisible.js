import libCom from '../../Common/Library/CommonLibrary';

export default function PartCreateIsVisible(context) {
    if (context.binding.ItemCategory === libCom.getAppParam(context, 'PART', 'TextItemCategory')) {
        return false;
    } 
    return true;
}
