/**
 * Return: Number of items in the collection
 */
export default function GetCount(clientAPI) {
    return clientAPI.evaluateTargetPath('#Count');
}
