import libCom from '../../Common/Library/CommonLibrary';

export default function MeasuringPointSkipVisible(context) {

    let allowSkip = libCom.getAppParam(context, 'MEASURINGPOINT', 'EnableReadingSkip');

    if (allowSkip) {
        return (allowSkip.toLowerCase() === 'y');
    }

    return false;
}
