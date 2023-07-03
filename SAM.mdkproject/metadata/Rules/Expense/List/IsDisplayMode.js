import IsEditMode from './IsEditMode';

export default function IsDisplayMode(context) {
    return !IsEditMode(context);
}
