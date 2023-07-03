//
//  BarcodeScannerBridgeExt.h
//  BarcodeScanner
//
//  Created by Kieselmann, Markus on 16/03/2017.
//  Copyright © 2017 SAP SE. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "BarcodePluginDelegate.h"

typedef void (^BarcodeScannerExtBridgeCallback)(NSDictionary* data, NSString* type);
@interface BarcodeScannerExtBridge : NSObject
@property (nonatomic, copy) BarcodeScannerExtBridgeCallback callback;
-(UIViewController*)createWithParams:(NSDictionary*)params andDelegate:(BarcodePluginDelegate*) delegate;

@end
