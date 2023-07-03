import libForm from '../Common/Library/FormatLibrary';

export default function PartBatch(pageClientAPI) {
    if (!pageClientAPI) {
        throw new TypeError('Context can\'t be null or undefined');
    }

    if (pageClientAPI.binding.MaterialBatch_Nav) {
        let batch = pageClientAPI.binding.MaterialBatch_Nav.Batch;
        let type = pageClientAPI.binding.MaterialBatch_Nav.BatchType;
        return libForm.getFormattedKeyDescriptionPair(pageClientAPI, batch, type);
    }

    return '-';
}
