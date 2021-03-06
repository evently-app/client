package com.evently;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.calendarevents.CalendarEventsPackage;
import com.mapbox.rctmgl.RCTMGLPackage;
import com.airbnb.android.react.lottie.LottiePackage;
import com.horcrux.svg.SvgPackage;
import com.cmcewen.blurview.BlurViewPackage;
import com.wix.interactable.Interactable;
import io.invertase.firebase.RNFirebasePackage;
import com.mkuczera.RNReactNativeHapticFeedbackPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new CalendarEventsPackage(),
            new RCTMGLPackage(),
            new LottiePackage(),
            new SvgPackage(),
            new BlurViewPackage(),
            new Interactable(),
            new RNFirebasePackage(),
            new RNReactNativeHapticFeedbackPackage(),
            new LinearGradientPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
