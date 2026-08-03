package com.animation

import android.content.Context
import android.graphics.Color
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

    private val layoutManager =
        LinearLayoutManager(context)

    private val positionMapper =
        WheelPositionMapper()

    private val adapter =
        WheelPickerAdapter(
            emptyList(),
            style,
            positionMapper,
        )

    private val itemTransformer =
        WheelItemTransformer()

    private val scrollController =
        WheelScrollController(
            recyclerView,
            layoutManager,
            positionMapper,
        )

    private val initializer =
        WheelInitializer(
            recyclerView,
        )

    // private var pendingSelection = 0
    private var lastDispatchedIndex = RecyclerView.NO_POSITION

    private var suppressNextEvent = true

    private var selectedIndex = RecyclerView.NO_POSITION

    private var onWheelChange: ((Int, String) -> Unit)? = null

    init {
        recyclerView.layoutManager = layoutManager
        recyclerView.adapter = adapter

        recyclerView.layoutParams =
            LayoutParams(
                LayoutParams.MATCH_PARENT,
                LayoutParams.MATCH_PARENT,
            )

        recyclerView.setBackgroundColor(Color.GREEN)

        recyclerView.addOnScrollListener(
            WheelScrollListener(
                onScrolledCallback = {
                    scrollController.onScrolled(style.itemHeight)

                    updateVisibleItems()
                    updateSelectedItem()
                },
                onIdleCallback = {

                    scrollController.onScrollIdle(
                        style.itemHeight,
                    )

                    val selected =
                        scrollController.getCenteredRealIndex()

                    if (selected != RecyclerView.NO_POSITION) {
                        notifySelectionFinished(selected)
                    }
                },
            ),
        )

        addView(recyclerView)
    }

    private fun dpToPx(dp: Int): Int {
        return (dp * resources.displayMetrics.density).toInt()
    }

    private fun refreshStyle() {
        adapter.notifyDataSetChanged()
    }

    private fun updateWheelSize() {
        post {
            val params = recyclerView.layoutParams

            params.height = style.itemHeight * style.visibleItemCount

            recyclerView.layoutParams = params

            recyclerView.requestLayout()
        }
    }

    private fun updateVisibleItems() {
        itemTransformer.apply(
            recyclerView = recyclerView,
            selectedIndex = selectedIndex,
            style = style,
            positionMapper = positionMapper,
        )
    }

    private fun updateSelectedItem() {
        val realIndex =
            scrollController.getCenteredRealIndex()

        if (realIndex == RecyclerView.NO_POSITION) {
            return
        }

        if (realIndex == selectedIndex) {
            return
        }

        selectedIndex = realIndex

        updateVisibleItems()

        // dispatchWheelChange(realIndex)
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
        adapter.setItems(items)

        initializer.reset()

        initializer.initializeIfNeeded { pendingSelection ->

            scrollController.scrollToRealIndex(
                pendingSelection,
                style.itemHeight,
            )

            recyclerView.post {
                scrollController.onScrollIdle(
                    style.itemHeight,
                )

                recyclerView.post {
                    val centered =
                        scrollController.getCenteredRealIndex()

                    selectedIndex = centered

                    updateVisibleItems()

                    dispatchWheelChange(centered)
                }
            }
        }
    }

    fun setSelectedIndex(index: Int) {
        initializer.setPendingSelection(index)

        if (adapter.getRealItemCount() == 0) {
            return
        }

        scrollController.scrollToRealIndex(
            index,
            style.itemHeight,
        )

        selectedIndex = index

        updateVisibleItems()
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

    // Helper function to dispatch the wheel change event
    private fun dispatchWheelChange(index: Int) {
        if (index == RecyclerView.NO_POSITION) {
            return
        }

        val value = adapter.getItemByRealIndex(index)

        onWheelChange?.invoke(index, value)
    }

    fun setOnWheelChangeListener(listener: (Int, String) -> Unit) {
        onWheelChange = listener
    }

    private fun notifySelectionFinished(index: Int) {
        if (suppressNextEvent) {
            suppressNextEvent = false
            lastDispatchedIndex = index
            return
        }

        if (index == lastDispatchedIndex) {
            return
        }

        lastDispatchedIndex = index
        dispatchWheelChange(index)
    }
}
