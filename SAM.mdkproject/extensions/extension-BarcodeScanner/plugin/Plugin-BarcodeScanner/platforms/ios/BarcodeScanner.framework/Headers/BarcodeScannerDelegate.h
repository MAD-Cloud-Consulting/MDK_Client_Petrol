
//
//  BarcodeScannerDelegate.h
//  BarcodeScanner
//
//  Created by Kieselmann, Markus on 16/03/2017.
//  Copyright © 2017 SAP SE. All rights reserved.
//

#import <UIKit/UIKit.h>

@class BarcodeScannerViewController;

@protocol BarcodeScannerDelegate

- (void)barcodeScanner:(nonnull BarcodeScannerViewController*)barcodeScannerViewController didReceiveScanResults:(nonnull NSArray<NSString*>*)scanResults forBusinessObjectWithId:(nullable NSString*)businessObjectId;
- (void)barcodeScanner:(nonnull BarcodeScannerViewController*)barcodeScannerViewController didPerformErrorActionOnBusinessObjectWithId:(nullable NSString*)businessObjectId;
- (void)barcodeScanner:(nonnull BarcodeScannerViewController*)barcodeScannerViewController didPerformAction:(nonnull NSString*)action onBusinessObjectWithId:(nonnull NSString*)businessObjectId;

@end
