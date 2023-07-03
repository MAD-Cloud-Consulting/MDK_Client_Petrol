
export default function ErrorArchiveIsVisible(context) {
    if (context.binding.ErrorObject.RequestURL === '$1') {
        return false;
    } 
    return true;
}
