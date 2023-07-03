export default function RegisterIsMaxPeakUsage(context) {
    if (context.binding.DateMaxRead) {
        return context.localizeText('yes');
    }
    return context.localizeText('no');
}
