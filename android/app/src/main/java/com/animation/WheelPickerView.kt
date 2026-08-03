package com.animation

import android.content.Context
import android.graphics.Color
import android.util.Log
import android.widget.FrameLayout
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView

class WheelPickerView(context: Context) : FrameLayout(context) {
    companion object {
        const val DEFAULT_ITEM_HEIGHT_DP = 48
    }

    private val style =
        WheelPickerStyle(
            itemHeight = dpToPx(DEFAULT_ITEM_HEIGHT_DP),
        )

    private val recyclerView = RecyclerView(context)

    private val adapter =
        WheelPickerAdapter(
            emptyList(),
            style,
        )

    private var initialSelectedIndex = 0
    private var selectedIndex = RecyclerView.NO_POSITION

    private var onWheelChange: ((Int, String) -> Unit)? = null

    init {
        recyclerView.layoutManager = LinearLayoutManager(context)
        recyclerView.adapter = adapter

        recyclerView.layoutParams =
            LayoutParams(
                LayoutParams.MATCH_PARENT,
                LayoutParams.MATCH_PARENT,
            )

        recyclerView.setBackgroundColor(Color.GREEN)

        recyclerView.addOnScrollListener(
            object : RecyclerView.OnScrollListener() {
                override fun onScrolled(
                    recyclerView: RecyclerView,
                    dx: Int,
                    dy: Int,
                ) {
                    updateVisibleItems()
                    updateSelectedItem()
                }

                override fun onScrollStateChanged(
                    recyclerView: RecyclerView,
                    newState: Int,
                ) {
                    super.onScrollStateChanged(recyclerView, newState)

                    if (newState == RecyclerView.SCROLL_STATE_IDLE) {
                        snapToCenter()
                    }
                }
            },
        )

        addView(recyclerView)
    }

    private fun dpToPx(dp: Int): Int {
        return (dp * resources.displayMetrics.density).toInt()
    }

    private fun refreshStyle() {
        adapter.notifyDataSetChanged()
    }

    private val layoutManager: LinearLayoutManager
        get() = recyclerView.layoutManager as LinearLayoutManager

    private fun updateWheelSize() {
        post {
            val params = recyclerView.layoutParams

            params.height = style.itemHeight * style.visibleItemCount

            recyclerView.layoutParams = params

            recyclerView.requestLayout()
        }
    }

    private fun findCenteredPosition(): Int {
        if (recyclerView.childCount == 0) {
            return RecyclerView.NO_POSITION
        }

        val recyclerCenter = recyclerView.height / 2

        var closestDistance = Int.MAX_VALUE
        var closestPosition = RecyclerView.NO_POSITION

        for (i in 0 until recyclerView.childCount) {
            val child = recyclerView.getChildAt(i)

            val position = recyclerView.getChildAdapterPosition(child)
            if (position == RecyclerView.NO_POSITION) continue

            val childCenter = (child.top + child.bottom) / 2
            val distance = kotlin.math.abs(childCenter - recyclerCenter)

            if (distance < closestDistance) {
                closestDistance = distance
                closestPosition = position
            }
        }

        return closestPosition
    }

    private fun updateVisibleItems() {
        val recyclerCenter = recyclerView.height / 2f

        for (i in 0 until recyclerView.childCount) {
            val child = recyclerView.getChildAt(i)

            val holder =
                recyclerView.getChildViewHolder(child)
                    as WheelPickerAdapter.ViewHolder

            val position = holder.bindingAdapterPosition

            if (position == RecyclerView.NO_POSITION) {
                continue
            }

            holder.textView.textSize = style.textSize

            holder.textView.setTextColor(
                if (position == selectedIndex) {
                    style.selectedTextColor
                } else {
                    style.textColor
                },
            )

            holder.textView.setBackgroundColor(style.backgroundColor)

            // ------------------------------------
            // Scale
            // ------------------------------------

            val childCenter =
                (child.top + child.bottom) / 2f

            val distance =
                kotlin.math.abs(childCenter - recyclerCenter)

            val fraction =
                (distance / recyclerCenter)
                    .coerceIn(0f, 1f)

            val scale =
                1.15f - (0.35f * fraction)

            child.scaleX = scale
            child.scaleY = scale

            // ------------------------------------
// Alpha
// ------------------------------------

            val alpha =
                1f - (0.70f * fraction)

            child.alpha = alpha
        }
    }

    private fun updateSelectedItem() {
        val centered = findCenteredPosition()

        if (centered == RecyclerView.NO_POSITION) {
            return
        }

        if (centered != selectedIndex) {
            selectedIndex = centered

            adapter.setSelectedIndex(centered)

            updateVisibleItems()

            dispatchWheelChange(centered)
        }
    }

    override fun onMeasure(
        widthMeasureSpec: Int,
        heightMeasureSpec: Int,
    ) {
        val desiredHeight =
            style.itemHeight * style.visibleItemCount

        val width = MeasureSpec.getSize(widthMeasureSpec)

        setMeasuredDimension(width, desiredHeight)

        measureChildren(
            widthMeasureSpec,
            MeasureSpec.makeMeasureSpec(
                desiredHeight,
                MeasureSpec.EXACTLY,
            ),
        )
    }

    fun setItems(items: List<String>) {
        Log.d("WheelPicker", "setItems size=${items.size}")
        adapter.setItems(items)
    }

    fun setSelectedIndex(index: Int) {
        Log.d("WheelPicker", "setSelectedIndex=$index")

        initialSelectedIndex = index

        if (adapter.itemCount == 0) {
            return
        }

        val safeIndex = index.coerceIn(0, adapter.itemCount - 1)

        recyclerView.post {
            val offset = (recyclerView.height - style.itemHeight) / 2

            layoutManager.scrollToPositionWithOffset(safeIndex, offset)

            selectedIndex = safeIndex

            adapter.setSelectedIndex(safeIndex)

            updateVisibleItems()
        }
    }

    fun setItemHeight(heightDp: Int) {
        style.itemHeight = dpToPx(heightDp)
        refreshStyle()
        updateWheelSize()
    }

    fun setTextSize(size: Float) {
        style.textSize = size
        refreshStyle()
    }

    fun setTextColor(color: Int) {
        style.textColor = color
        refreshStyle()
    }

    fun setSelectedTextColor(color: Int) {
        style.selectedTextColor = color
        refreshStyle()
    }

    fun setItemBackgroundColor(color: Int) {
        style.backgroundColor = color
        refreshStyle()
    }

    fun setVisibleItemCount(count: Int) {
        style.visibleItemCount = count
        updateWheelSize()
    }

    private fun snapToCenter() {
        val position = findCenteredPosition()

        if (position == RecyclerView.NO_POSITION) {
            return
        }

        val child =
            layoutManager.findViewByPosition(position)
                ?: return

        val recyclerCenter = recyclerView.height / 2

        val childCenter =
            (child.top + child.bottom) / 2

        val distance =
            childCenter - recyclerCenter

        Log.d(
            "WheelPicker",
            "Snap distance = $distance",
        )

        if (distance != 0) {
            recyclerView.smoothScrollBy(
                0,
                distance,
            )
        }
    }

    // Helper function to dispatch the wheel change event
    private fun dispatchWheelChange(index: Int) {
        if (index == RecyclerView.NO_POSITION) {
            return
        }

        val value = adapter.getItem(index)

        onWheelChange?.invoke(index, value)
    }

    fun setOnWheelChangeListener(listener: (Int, String) -> Unit) {
        onWheelChange = listener
    }

    private fun updateItemTransforms() {
    }
}
