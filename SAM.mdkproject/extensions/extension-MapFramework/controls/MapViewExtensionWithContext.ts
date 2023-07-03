import { MapViewExtension } from './MapViewExtension';

export class MapViewExtensionWithContext extends MapViewExtension {
    public initialize(props) {
        super.initialize(props);

        if (this.context.binding && this.context.binding.mapData) {
            this.context.binding = this.context.binding.mapData;
        }

    }

    protected readFromContext() {
        return true;
    }
}
