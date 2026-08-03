package com.animation

class WheelPositionMapper {
    companion object {
        /**
         * Large enough that a user will never reach the ends.
         */
        const val VIRTUAL_ITEM_COUNT = Int.MAX_VALUE

        /**
         * Middle of the virtual list.
         */
        private const val VIRTUAL_CENTER = Int.MAX_VALUE / 2
    }

    private var itemCount = 0

    private var loop = true

    fun setItemCount(count: Int) {
        itemCount = count
    }

    fun getItemCount(): Int {
        return itemCount
    }

    /**
     * Adapter size seen by RecyclerView.
     */
    fun getVirtualItemCount(): Int {
        if (itemCount == 0) {
            return 0
        }

        return if (loop) {
            VIRTUAL_ITEM_COUNT
        } else {
            itemCount
        }
    }

    /**
     * Converts adapter position -> real data index.
     */
    fun getRealIndex(adapterPosition: Int): Int {
        if (itemCount == 0) {
            return 0
        }

        if (!loop) {
            return adapterPosition.coerceIn(
                0,
                itemCount - 1,
            )
        }

        var index = adapterPosition % itemCount

        if (index < 0) {
            index += itemCount
        }

        return index
    }

    /**
     * Returns a virtual adapter position positioned near the middle
     * of the list for a given real item.
     */
    fun getAdapterPosition(realIndex: Int): Int {
        if (itemCount == 0) {
            return 0
        }

        val safeIndex =
            realIndex.coerceIn(
                0,
                itemCount - 1,
            )

        return if (loop) {
            VIRTUAL_CENTER -
                (VIRTUAL_CENTER % itemCount) +
                safeIndex
        } else {
            safeIndex
        }
    }

    /**
     * Re-centers an adapter position while preserving
     * the currently selected real item.
     */
    fun recenterAdapterPosition(adapterPosition: Int): Int {
        return getAdapterPosition(
            getRealIndex(adapterPosition),
        )
    }

    /**
     * True only when we are extremely far from the virtual center.
     *
     * In practice this almost never happens.
     */
    fun shouldRecenter(adapterPosition: Int): Boolean {
        if (!loop) {
            return false
        }

        val distance =
            kotlin.math.abs(
                adapterPosition - VIRTUAL_CENTER,
            )

        return distance > 1_000_000
    }

    /**
     * Sets whether the wheel should loop or not.
     */

    fun setLoop(loop: Boolean) {
        this.loop = loop
    }
}
