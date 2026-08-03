package com.animation

import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.events.Event

class WheelPickerChangeEvent(
    surfaceId: Int,
    viewId: Int,
    private val payload: WritableMap,
) : Event<WheelPickerChangeEvent>(surfaceId, viewId) {
    override fun getEventName(): String {
        return "onWheelChange"
    }

    override fun getEventData(): WritableMap {
        return payload
    }
}
