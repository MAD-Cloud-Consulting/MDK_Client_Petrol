export default function GetInventoryObjectId(context) {
    let binding = context.getBindingObject();
    if (binding) {
        switch (binding.IMObject) {
            case 'PRD':
                if (binding.GenericObjectId) return binding.GenericObjectId;
                break;
            default:
                if (binding.ObjectId) return binding.ObjectId;
        }
    }
    return '';
}
