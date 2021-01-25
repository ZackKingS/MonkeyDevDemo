// See http://iphonedevwiki.net/index.php/Logos

#import <UIKit/UIKit.h>
#import <CoreLocation/CoreLocation.h>

@interface LocationViewController
- (void)verificationLocation:(double)arg1 andLat:(double)arg2;
@end
%hook LocationViewController
 
////更新定位
- (void)locationManager:(CLLocationManager *)manager didUpdateLocations:(NSArray *)locations{
 
//    %orig;
    
    //错误地址
//    [self verificationLocation:112.407001 andLat:31.496220];
    
    //正确地址
    [self verificationLocation:114.407001 andLat:30.496220];
}
 
  
 
%end
