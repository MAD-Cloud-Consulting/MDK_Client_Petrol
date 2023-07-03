import MarkedJobLibrary from '../../MarkedJobs/MarkedJobLibrary';

export default function Icon(context) {
    return MarkedJobLibrary.isMarked(context).then(result => {
        if (result) {
            return 'ActionIsMarked';
        }
        return 'ActionNotMarked';
    });
}
