/**
* Returns header with extra information from 
* multiple fields, if data exists in them
* @param {IClientAPI} context
*/
export default function TitleItemFormatting(context) {
    let binding = context.binding;
    if (!binding) return '';
    let title = binding.Material;
    if (binding.StorageBin) {
        title += `/${binding.StorageBin}`;
        if (binding.Batch) {
            title += `/${binding.Batch}`;
        }
    }
    return title;
}
