import errorArchiveCount from './ErrorArchiveCount';

export default function ErrorsArchiveOnReturn(context) {
    return errorArchiveCount(context).then(result => {
        context.setCaption(result);
        return true;
    });
}
