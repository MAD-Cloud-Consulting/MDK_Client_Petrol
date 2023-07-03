import MeasuringPointFDCIsVisible from '../Measurements/Points/MeasuringPointFDCIsVisible';

export default function KPIPointDesc(context) {
    return MeasuringPointFDCIsVisible(context).then(visible => {
        if (visible) {
            return context.localizeText('readings_taken');
        } else {
            return '';
        }
    });
}
