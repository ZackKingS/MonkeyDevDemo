#line 1 "/Users/zack/Desktop/MonkeyDevDemo/MonkeyDevDemoDylib/Logos/MonkeyDevDemoDylib.xm"


#import <UIKit/UIKit.h>
#import <CoreLocation/CoreLocation.h>


#include <substrate.h>
#if defined(__clang__)
#if __has_feature(objc_arc)
#define _LOGOS_SELF_TYPE_NORMAL __unsafe_unretained
#define _LOGOS_SELF_TYPE_INIT __attribute__((ns_consumed))
#define _LOGOS_SELF_CONST const
#define _LOGOS_RETURN_RETAINED __attribute__((ns_returns_retained))
#else
#define _LOGOS_SELF_TYPE_NORMAL
#define _LOGOS_SELF_TYPE_INIT
#define _LOGOS_SELF_CONST
#define _LOGOS_RETURN_RETAINED
#endif
#else
#define _LOGOS_SELF_TYPE_NORMAL
#define _LOGOS_SELF_TYPE_INIT
#define _LOGOS_SELF_CONST
#define _LOGOS_RETURN_RETAINED
#endif

@class LocationViewController; 
static void (*_logos_orig$_ungrouped$LocationViewController$locationManager$didUpdateLocations$)(_LOGOS_SELF_TYPE_NORMAL LocationViewController* _LOGOS_SELF_CONST, SEL, CLLocationManager *, NSArray *); static void _logos_method$_ungrouped$LocationViewController$locationManager$didUpdateLocations$(_LOGOS_SELF_TYPE_NORMAL LocationViewController* _LOGOS_SELF_CONST, SEL, CLLocationManager *, NSArray *); 

#line 6 "/Users/zack/Desktop/MonkeyDevDemo/MonkeyDevDemoDylib/Logos/MonkeyDevDemoDylib.xm"
@interface LocationViewController
- (void)verificationLocation:(double)arg1 andLat:(double)arg2;
@end

 

static void _logos_method$_ungrouped$LocationViewController$locationManager$didUpdateLocations$(_LOGOS_SELF_TYPE_NORMAL LocationViewController* _LOGOS_SELF_CONST __unused self, SEL __unused _cmd, CLLocationManager * manager, NSArray * locations){
 
    _logos_orig$_ungrouped$LocationViewController$locationManager$didUpdateLocations$(self, _cmd, manager, locations);
    
    

    
    
    [self verificationLocation:114.407001 andLat:30.496220];
}
 
  
 

static __attribute__((constructor)) void _logosLocalInit() {
{Class _logos_class$_ungrouped$LocationViewController = objc_getClass("LocationViewController"); { MSHookMessageEx(_logos_class$_ungrouped$LocationViewController, @selector(locationManager:didUpdateLocations:), (IMP)&_logos_method$_ungrouped$LocationViewController$locationManager$didUpdateLocations$, (IMP*)&_logos_orig$_ungrouped$LocationViewController$locationManager$didUpdateLocations$);}} }
#line 26 "/Users/zack/Desktop/MonkeyDevDemo/MonkeyDevDemoDylib/Logos/MonkeyDevDemoDylib.xm"
