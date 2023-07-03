import libComm from '../../Common/Library/CommonLibrary';
import GetMaterialName from './GetMaterialName';

/**
 * This function returns ItemText of the Purchase Order or STO. If the ItemText is blank, it then 
 * returns the material description of the MaterialNum property.
 */
 export default function GetItemTextOrMaterialName(context) {
    const binding = context.binding;
    if (libComm.isDefined(binding)) {
        const materialNum = binding.MaterialNum;

        if (libComm.isDefined(binding.ItemText)) {
            //Purchase order items and STOs will have the ItemText property
            if (!materialNum) {
                return binding.ItemText;
            }
            return materialNum + ' - ' + binding.ItemText;
        } else {
            //binding.ItemText is blank or undefined. Get the material description instead.
            return GetMaterialName(context).then(name => {
                if (!materialNum) {
                    return name;
                }
                return materialNum + ' - ' + name;
            });
        }
    }
    return '';
}
