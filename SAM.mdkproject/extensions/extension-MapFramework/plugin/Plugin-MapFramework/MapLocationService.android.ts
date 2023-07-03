
import * as geolocation from '@nativescript/geolocation';
import * as app from '@nativescript/core/application';
import { Utils as utils } from '@nativescript/core';
import { CoreTypes } from '@nativescript/core';

declare var com: any;
declare var android: any;

export const LOCATION_SERVICE_CLASSNAME = "sap.mdkclient.MDKAndroidLocationService";
export const LOCATION_SERVICE_INTENT = "sap.mdkclient.action.LOCATION_UPDATE";

@JavaProxy("sap.mdkclient.MDKAndroidLocationService")
@NativeClass()
class MDKAndroidLocationService extends android.app.Service {
    private _watchID: number = -1;

    onBind(): android.os.IBinder {
        return null;
    }

    onCreate(): void {
        super.onCreate();

        const appIntent: android.content.Intent = new android.content.Intent(app.android.context, com.tns.NativeScriptActivity.class);
        const pendingIntent: android.app.PendingIntent = android.app.PendingIntent.getActivity(app.android.context, 0,
            appIntent, android.app.PendingIntent.FLAG_IMMUTABLE);
        const builder: androidx.core.app.NotificationCompat.Builder = new androidx.core.app.NotificationCompat.Builder(app.android.context);
        
        builder.setContentText("SAP Svc&AssetMgr").setContentIntent(pendingIntent);

        if (android.os.Build.VERSION.SDK_INT >= 26) {
            const channel = new android.app.NotificationChannel(
                "sap.mdkclient.MDKAndroidLocationService", "Service running indicator", android.app.NotificationManager.IMPORTANCE_LOW
            );
            const manager = (app.android.context).getSystemService(android.content.Context.NOTIFICATION_SERVICE);
            channel.enableLights(false);
            channel.enableVibration(false);
            manager.createNotificationChannel(channel);
            builder.setChannelId("sap.mdkclient.MDKAndroidLocationService");
        }

        const NOTIFICATION_ID_SERVICE = 100;
        const notification: android.app.Notification = builder.build();
        this.startForeground(NOTIFICATION_ID_SERVICE, notification);
    }

    onStartCommand(intent: android.content.Intent, flags: number, startId: number): number {
        const updateDistance = intent.getIntExtra("UPDATED_DISTANCE", 100);
        try {
            this._watchID = geolocation.watchLocation(
                (loc) => {
                    if (loc) {
                        let geoJson = {
                            'type': 'Feature',
                            'geometry': {
                                'type': 'Point',
                                'coordinates': [],
                            },
                            'properties': null,
                        };
                        geoJson.geometry.coordinates.push([loc.latitude, loc.longitude]);
                        const intent = new android.content.Intent(LOCATION_SERVICE_INTENT);
                        intent.putExtra('GEO_JSON', JSON.stringify(geoJson));
                        var broadcastManager = androidx.localbroadcastmanager.content.LocalBroadcastManager.getInstance(utils.ad.getApplicationContext());
                        broadcastManager.sendBroadcast(intent);
                    }
                }, (e) => {
                    console.log("Error: " + (e.message || e));
                },
                {
                    desiredAccuracy: CoreTypes.Accuracy.high,
                    updateDistance: updateDistance
                });
        } catch (ex) {
            console.log("Unable to Enable Location", ex);
        }
        return android.app.Service.START_REDELIVER_INTENT;
    }

    onDestroy(): void {
        super.onDestroy();
        if (this._watchID > 0) {
            geolocation.clearWatch(this._watchID);
            this._watchID = -1;
        }
    }

    onTaskRemoved(intent: android.content.Intent): void {
        this.stopSelf();
    }
}

