export default function DocumentID(documentObject) {
    if (documentObject) {
        let odataID = documentObject['@odata.id'];
        // Retrieving ID from the string
        let start = odataID.indexOf('\'');
        let end = odataID.lastIndexOf('\'');
        // Need to do start+1 because we dont want ' in our id
        return odataID.substring(start+1, end);
    }
}

