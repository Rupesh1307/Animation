package com.animation

import androidx.recyclerview.widget.RecyclerView
import kotlin.math.abs

class WheelItemTransformer {
    private val itemStyle =
        WheelItemStyle()

    fun apply(
        recyclerView: RecyclerView,
        selectedIndex: Int,
        style: WheelPickerStyle,
        positionMapper: WheelPositionMapper,
    ) {
        val recyclerCenter = recyclerView.height / 2f

        for (i in 0 until recyclerView.childCount) {
            val child = recyclerView.getChildAt(i)

            val holder =
                recyclerView.getChildViewHolder(child)
                    as WheelPickerAdapter.ViewHolder

            val adapterPosition = holder.bindingAdapterPosition

            if (adapterPosition == RecyclerView.NO_POSITION) {
                continue
            }

            val realIndex =
                positionMapper.getRealIndex(adapterPosition)

            // Keep text color here for now
            itemStyle.apply(
                textView = holder.textView,
                style = style,
                isSelected = realIndex == selectedIndex,
            )

            // -------------------------
            // Scale
            // -------------------------

            val childCenter =
                (child.top + child.bottom) / 2f

            val distance =
                abs(childCenter - recyclerCenter)

            val fraction =
                (distance / recyclerCenter)
                    .coerceIn(0f, 1f)

            val scale =
                1.15f - (0.35f * fraction)

            child.scaleX = scale
            child.scaleY = scale

            // -------------------------
            // Alpha
            // -------------------------

            val alpha =
                1f - (0.70f * fraction)

            child.alpha = alpha
        }
    }
}
