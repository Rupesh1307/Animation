package com.animation

import android.graphics.Color
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.BaseViewManagerDelegate
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.viewmanagers.WheelPickerManagerDelegate
import com.facebook.react.viewmanagers.WheelPickerManagerInterface

@ReactModule(name = WheelPickerManager.NAME)
class WheelPickerManager :
    SimpleViewManager<WheelPickerView>(),
    WheelPickerManagerInterface<WheelPickerView> {
    companion object {
        const val NAME = "WheelPicker"
    }

    private val delegate = WheelPickerManagerDelegate(this)

    override fun getName(): String = NAME

    override fun createViewInstance(reactContext: ThemedReactContext): WheelPickerView {
        val view = WheelPickerView(reactContext)

        view.setOnWheelChangeListener { index, value ->

            val reactContext = reactContext

            val surfaceId =
                UIManagerHelper.getSurfaceId(reactContext)

            val dispatcher =
                UIManagerHelper.getEventDispatcherForReactTag(
                    reactContext,
                    view.id,
                )

            val payload =
                Arguments.createMap().apply {
                    putInt("index", index)
                    putString("value", value)
                }

            dispatcher?.dispatchEvent(
                WheelPickerChangeEvent(
                    surfaceId,
                    view.id,
                    payload,
                ),
            )
        }

        return view
    }

    override fun getDelegate(): BaseViewManagerDelegate<WheelPickerView, *> {
        return delegate
    }

    override fun getExportedCustomDirectEventTypeConstants(): MutableMap<String, Any> {
        return mutableMapOf(
            "onWheelChange" to
                mutableMapOf(
                    "registrationName" to "onWheelChange",
                ),
        )
    }

    override fun setData(
        view: WheelPickerView,
        value: ReadableArray?,
    ) {
        val items = mutableListOf<String>()

        value?.let {
            for (i in 0 until it.size()) {
                items.add(it.getString(i) ?: "")
            }
        }

        view.setItems(items)
    }

    override fun setSelectedIndex(
        view: WheelPickerView,
        value: Int,
    ) {
        view.setSelectedIndex(value)
    }

    override fun setItemHeight(
        view: WheelPickerView,
        value: Int,
    ) {
        view.setItemHeight(value)
    }

    override fun setTextSize(
        view: WheelPickerView,
        value: Float,
    ) {
        view.setTextSize(value)
    }

    override fun setTextColor(
        view: WheelPickerView,
        value: Int?,
    ) {
        view.setTextColor(value ?: Color.BLACK)
    }

    override fun setSelectedTextColor(
        view: WheelPickerView,
        value: Int?,
    ) {
        value?.let {
            view.setSelectedTextColor(it)
        }
    }

    override fun setBackgroundColor(
        view: WheelPickerView,
        value: Int?,
    ) {
        value?.let {
            view.setItemBackgroundColor(it)
        }
    }

    override fun setVisibleItemCount(
        view: WheelPickerView,
        value: Int,
    ) {
        view.setVisibleItemCount(value)
    }

    override fun setLoop(
        view: WheelPickerView,
        value: Boolean,
    ) {
        view.setLoop(value)
    }
}
