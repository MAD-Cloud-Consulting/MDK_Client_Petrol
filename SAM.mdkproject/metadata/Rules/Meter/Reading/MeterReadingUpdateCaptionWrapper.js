import updateCaption from './MeterReadingUpdateCaption';

export default function MeterReadingUpdateCaptionWrapper(context) {
    
    updateCaption(context.getPageProxy());
}
