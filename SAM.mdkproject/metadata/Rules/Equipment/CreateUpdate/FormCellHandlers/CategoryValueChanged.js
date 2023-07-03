import libCommon from '../../../Common/Library/CommonLibrary';
import CategoryValueChangedCommon from '../../../Common/Controls/Handlers/CategoryValueChanged';


export default function CategoryValueChanged(context) {
    CategoryValueChangedCommon(context, 'EquipCategory');

    libCommon.clearValidationOnInput(context);
}
