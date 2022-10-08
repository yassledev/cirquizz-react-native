package com.cirquizz;

import android.app.Application;

import com.airbnb.android.react.maps.BuildConfig;
import com.facebook.react.ReactApplication;
import com.kevinresol.react_native_default_preference.RNDefaultPreferencePackage;
import com.sensors.RNSensorsPackage;
import br.com.dopaminamob.gpsstate.GPSStatePackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.horcrux.svg.SvgPackage;
import com.reactnativecommunity.webview.RNCWebViewPackage;
import com.reactnativecommunity.netinfo.NetInfoPackage;
import com.airbnb.android.react.maps.MapsPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.reactcommunity.rnlocalize.RNLocalizePackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.reactnativecommunity.netinfo.NetInfoPackage;


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
            new RNDefaultPreferencePackage(),
            new RNSensorsPackage(),
            new GPSStatePackage(),
            new VectorIconsPackage(),
            new SvgPackage(),
            new RNCWebViewPackage(),
            new MapsPackage(),
            new SplashScreenReactPackage(),
            new RNLocalizePackage(),
            new RNGestureHandlerPackage(),
            new RNI18nPackage(),
            new NetInfoPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index.android";
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
