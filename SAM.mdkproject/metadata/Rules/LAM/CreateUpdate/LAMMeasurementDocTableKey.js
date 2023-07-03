
import generateID from '../../Common/GenerateLocalID';

export default function LAMMeasurementDocTableKey(context) {
    
   return generateID(context, 'LAMObjectData', 'TableKey', '000000000000000000000000', '$filter=startswith(TableKey,\'LOCAL_\') eq true', 'LOCAL_');
}
