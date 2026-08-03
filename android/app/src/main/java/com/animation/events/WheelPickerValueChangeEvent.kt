package com.animation.event

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.events.Event

class WheelPickerValueChangeEvent(
    surfaceId: Int,
    viewId: Int,
    private val index: Int,
    private val item: String,
) : Event<WheelPickerValueChangeEvent>(surfaceId, viewId) {
    override fun getEventName(): String {
        return "topValueChange"
    }

    override fun getEventData(): WritableMap {
        return Arguments.createMap().apply {
            putInt("index", index)
            putString("item", item)
        }
    }
}
