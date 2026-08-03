package com.animation

import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.viewmanagers.ColorBoxManagerDelegate
import com.facebook.react.viewmanagers.ColorBoxManagerInterface
import com.facebook.react.uimanager.SimpleViewManager

@ReactModule(name = ColorBoxManager.REACT_CLASS)
class ColorBoxManager :
    SimpleViewManager<ColorBoxView>(),
    ColorBoxManagerInterface<ColorBoxView> {

    private val delegate = ColorBoxManagerDelegate(this)

    override fun getDelegate() = delegate

    override fun getName() = REACT_CLASS

    override fun createViewInstance(context: ThemedReactContext): ColorBoxView {
        return ColorBoxView(context)
    }

    override fun setColor(view: ColorBoxView, value: String?) {
        view.setColor(value)
    }

    companion object {
        const val REACT_CLASS = "ColorBox"
    }
}