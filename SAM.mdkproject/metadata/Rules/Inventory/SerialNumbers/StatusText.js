export default function StatusText(clientAPI) {
    if (clientAPI.binding.Description) {
        return clientAPI.binding.Description;
    }
    return clientAPI.binding.downloaded ? '' : 'New';
}
