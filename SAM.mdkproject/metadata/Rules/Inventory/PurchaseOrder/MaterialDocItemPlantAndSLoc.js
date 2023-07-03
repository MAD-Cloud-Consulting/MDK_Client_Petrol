import commonLib from '../../Common/Library/CommonLibrary';

export default function MaterialDocItemPlantAndSLoc(context) {
    const binding = context.binding;
    if (binding) {
        const plantExists = commonLib.isDefined(binding.Plant);
        const sLocExists = commonLib.isDefined(binding.StorageLocation);
        if (plantExists && sLocExists) {
            return binding.Plant + '/' + binding.StorageLocation;
        } else if (plantExists) {
            return binding.Plant;
        } else if (sLocExists) {
            return binding.StorageLocation;
        }
    }
    return '';
}
