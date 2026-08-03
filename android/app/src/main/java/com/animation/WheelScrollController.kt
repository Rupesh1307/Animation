package com.animation

import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import kotlin.math.abs

class WheelScrollController(
    private val recyclerView: RecyclerView,
    private val layoutManager: LinearLayoutManager,
    private val positionMapper: WheelPositionMapper,
) {
    /**
     * Scroll to a real item near the virtual center.
     */
    fun scrollToRealIndex(
        realIndex: Int,
        itemHeight: Int,
    ) {
        if (positionMapper.getItemCount() == 0) {
            return
        }

        val adapterPosition =
            positionMapper.getAdapterPosition(realIndex)

        val offset =
            (recyclerView.height - itemHeight) / 2

        layoutManager.scrollToPositionWithOffset(
            adapterPosition,
            offset,
        )
    }

    /**
     * Returns adapter position closest to RecyclerView center.
     */
    fun findCenteredAdapterPosition(): Int {
        if (recyclerView.childCount == 0) {
            return RecyclerView.NO_POSITION
        }

        val recyclerCenter =
            recyclerView.height / 2

        var closestDistance = Int.MAX_VALUE
        var closestPosition = RecyclerView.NO_POSITION

        for (i in 0 until recyclerView.childCount) {
            val child =
                recyclerView.getChildAt(i)

            val adapterPosition =
                recyclerView.getChildAdapterPosition(child)

            if (adapterPosition == RecyclerView.NO_POSITION) {
                continue
            }

            val childCenter =
                (child.top + child.bottom) / 2

            val distance =
                abs(childCenter - recyclerCenter)

            if (distance < closestDistance) {
                closestDistance = distance
                closestPosition = adapterPosition
            }
        }

        return closestPosition
    }

    /**
     * Returns currently selected REAL index.
     */
    fun getCenteredRealIndex(): Int {
        val adapterPosition =
            findCenteredAdapterPosition()

        if (adapterPosition == RecyclerView.NO_POSITION) {
            return RecyclerView.NO_POSITION
        }

        return positionMapper.getRealIndex(
            adapterPosition,
        )
    }

    /**
     * Snap nearest child to center.
     */
    fun snapToCenter(adapterPosition: Int) {
        if (adapterPosition == RecyclerView.NO_POSITION) {
            return
        }

        val child =
            layoutManager.findViewByPosition(
                adapterPosition,
            ) ?: return

        val recyclerCenter =
            recyclerView.height / 2

        val childCenter =
            (child.top + child.bottom) / 2

        val dy =
            childCenter - recyclerCenter

        if (dy != 0) {
            recyclerView.smoothScrollBy(
                0,
                dy,
            )
        }
    }

    /**
     * Keeps the wheel close to the virtual center.
     *
     * User never notices this jump because
     * the real item stays exactly the same.
     */
    fun recenterIfNeeded(itemHeight: Int) {
        val adapterPosition =
            findCenteredAdapterPosition()

        if (adapterPosition == RecyclerView.NO_POSITION) {
            return
        }

        if (!positionMapper.shouldRecenter(adapterPosition)) {
            return
        }

        val newPosition =
            positionMapper.recenterAdapterPosition(
                adapterPosition,
            )

        val offset =
            (recyclerView.height - itemHeight) / 2

        layoutManager.scrollToPositionWithOffset(
            newPosition,
            offset,
        )
    }

    /**
     * Call continuously while scrolling.
     */
    fun onScrolled(itemHeight: Int) {
        recenterIfNeeded(itemHeight)
    }

    /**
     * Call when scrolling stops.
     */
    fun onScrollIdle(itemHeight: Int): Int {
        val centered =
            findCenteredAdapterPosition()

        if (centered == RecyclerView.NO_POSITION) {
            return RecyclerView.NO_POSITION
        }

        snapToCenter(centered)

        recyclerView.post {
            recenterIfNeeded(itemHeight)
        }

        return getCenteredRealIndex()
    }
}
