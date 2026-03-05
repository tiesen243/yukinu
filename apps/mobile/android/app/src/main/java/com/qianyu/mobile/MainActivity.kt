package com.qianyu.mobile

import android.os.Bundle
import android.content.res.Configuration

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

import org.devio.rn.splashscreen.SplashScreen
import com.swmansion.rnscreens.fragment.restoration.RNScreensFragmentFactory

class MainActivity : ReactActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    supportFragmentManager.fragmentFactory = RNScreensFragmentFactory()

    val nightFlag = resources.configuration.uiMode and Configuration.UI_MODE_NIGHT_MASK
    val isDark = nightFlag == Configuration.UI_MODE_NIGHT_YES
    setTheme(if (isDark) R.style.DarkTheme else R.style.LightTheme)
    SplashScreen.show(this)

    super.onCreate(savedInstanceState)
  }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "qianyu"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
