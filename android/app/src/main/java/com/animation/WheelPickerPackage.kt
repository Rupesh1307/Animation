package com.animation

import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider
import com.facebook.react.uimanager.ViewManager

class WheelPickerPackage : BaseReactPackage() {
    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        return listOf(
            WheelPickerManager(),
        )
    }

    override fun getModule(
        name: String,
        reactContext: ReactApplicationContext,
    ): NativeModule? {
        return null
    }

    override fun getReactModuleInfoProvider(): ReactModuleInfoProvider {
        return ReactModuleInfoProvider {
            val moduleInfos = HashMap<String, ReactModuleInfo>()

            moduleInfos[WheelPickerManager.NAME] =
                ReactModuleInfo(
                    WheelPickerManager.NAME,
                    WheelPickerManager.NAME,
                    false, // canOverrideExistingModule
                    false, // needsEagerInit
                    true, // hasConstants
                    false, // isCxxModule
                    false, // isTurboModule
                )

            moduleInfos
        }
    }
}
