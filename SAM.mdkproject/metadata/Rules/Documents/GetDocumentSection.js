export default function GetDocumentSection(sections) {
    let documentSection;
    sections.forEach(function(key) {
        if (key.getName() === 'DocumentSection') {
            documentSection = key;
        } 
    });
    return documentSection;
}
