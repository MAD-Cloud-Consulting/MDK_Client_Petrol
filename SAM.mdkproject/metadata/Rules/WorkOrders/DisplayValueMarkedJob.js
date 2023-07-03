export default function DisplayValueMarkedJob(context) {
    let binding = context.getBindingObject();
    if (binding.MarkedJob.PreferenceValue === 'true') {
        return true;
    }
    return false;
}
