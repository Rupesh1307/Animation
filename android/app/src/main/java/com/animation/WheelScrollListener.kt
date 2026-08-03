package com.animation

import androidx.recyclerview.widget.RecyclerView

class WheelScrollListener(
    private val onScrolledCallback: () -> Unit,
    private val onIdleCallback: () -> Unit,
) : RecyclerView.OnScrollListener() {




    override fun onScrolled(
        recyclerView: RecyclerView,
        dx: Int,
        dy: Int,
    ) {
        onScrolledCallback()
    }

    override fun onScrollStateChanged(
        recyclerView: RecyclerView,
        newState: Int,
    ) {
        super.onScrollStateChanged(
            recyclerView,
            newState,
        )

        if (newState == RecyclerView.SCROLL_STATE_IDLE) {
            onIdleCallback()
        }
    }

    
}
