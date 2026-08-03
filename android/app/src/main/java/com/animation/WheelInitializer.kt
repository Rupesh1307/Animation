package com.animation

import androidx.recyclerview.widget.RecyclerView

class WheelInitializer(
    private val recyclerView: RecyclerView,
) {

    private var initialized = false

    private var pendingSelection = 0

    fun reset() {
        initialized = false
    }

    fun setPendingSelection(index: Int) {
        pendingSelection = index
    }

    fun initializeIfNeeded(
        action: (selectedIndex: Int) -> Unit,
    ) {

        if (initialized) {
            return
        }

        if (recyclerView.childCount == 0) {
            recyclerView.post {
                initializeIfNeeded(action)
            }
            return
        }

        initialized = true

        action(pendingSelection)
    }
}