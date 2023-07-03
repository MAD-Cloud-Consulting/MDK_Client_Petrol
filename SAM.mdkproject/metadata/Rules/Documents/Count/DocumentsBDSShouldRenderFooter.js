import DocumentsBDSCount from './DocumentsBDSCount';

export default async function DocumentsBDSShouldRenderFooter(controlProxy) {
    const documentsCount = await DocumentsBDSCount(controlProxy);

    return documentsCount > 2;
}
