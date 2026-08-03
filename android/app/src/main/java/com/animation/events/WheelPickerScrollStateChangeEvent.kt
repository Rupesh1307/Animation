package com.animation.event

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.events.Event

class WheelPickerScrollStateChangeEvent(
    surfaceId: Int,
    viewId: Int,
    private val state: Int,
) : Event<WheelPickerScrollStateChangeEvent>(surfaceId, viewId) {
    override fun getEventName(): String {
        return "onScrollStateChange"
    }

    override fun getEventData(): WritableMap {
        return Arguments.createMap().apply {
            putInt("state", state)
        }
    }
}
