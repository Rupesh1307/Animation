package com.animation

import android.graphics.Color
import android.util.Log
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.BaseViewManagerDelegate
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
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
        return WheelPickerView(reactContext)
    }

    override fun getDelegate(): BaseViewManagerDelegate<WheelPickerView, *> {
        return delegate
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
}
