package com.animation.event

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.events.Event

class WheelPickerScrollEvent(
    surfaceId: Int,
    viewId: Int,
    private val offset: Double,
) : Event<WheelPickerScrollEvent>(surfaceId, viewId) {
    override fun getEventName(): String {
        return "onScroll"
    }

    override fun getEventData(): WritableMap {
        return Arguments.createMap().apply {
            putDouble("offset", offset)
        }
    }
}
