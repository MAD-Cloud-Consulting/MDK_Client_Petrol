import measuringPointsEntity from './MeasuringPointsListViewEntitySet';
import measuringPointsQueryOption from './MeasuringPointsListViewQueryOption';
export default function MeasuringPointsCaptions(context) {
    return context.count('/SAPAssetManager/Services/AssetManager.service', measuringPointsEntity(context), measuringPointsQueryOption(context)).then(count => {
        let params=[count];
        return context.localizeText('measuring_points_x',params);
    });
}
