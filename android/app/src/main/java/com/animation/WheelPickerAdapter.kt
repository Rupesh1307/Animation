package com.animation

import android.view.Gravity
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView

class WheelPickerAdapter(
    private var items: List<String>,
    private val style: WheelPickerStyle,
    private var selectedIndex: Int = RecyclerView.NO_POSITION,
) : RecyclerView.Adapter<WheelPickerAdapter.ViewHolder>() {
    class ViewHolder(
        val textView: TextView,
    ) : RecyclerView.ViewHolder(textView)

    override fun onCreateViewHolder(
        parent: ViewGroup,
        viewType: Int,
    ): ViewHolder {
        val textView =
            TextView(parent.context).apply {
                layoutParams =
                    RecyclerView.LayoutParams(
                        ViewGroup.LayoutParams.MATCH_PARENT,
                        style.itemHeight,
                    )

                gravity = Gravity.CENTER
                textSize = style.textSize
                setTextColor(style.textColor)
                setBackgroundColor(style.backgroundColor)
            }

        return ViewHolder(textView)
    }

    private fun applyStyle(
        holder: ViewHolder,
        position: Int,
    ) {
        holder.textView.text = items[position]

        val params = holder.textView.layoutParams as RecyclerView.LayoutParams
        params.height = style.itemHeight
        holder.textView.layoutParams = params

        holder.textView.textSize = style.textSize

        holder.textView.setTextColor(
            if (position == selectedIndex) {
                style.selectedTextColor
            } else {
                style.textColor
            },
        )

        holder.textView.setBackgroundColor(style.backgroundColor)

        holder.textView.requestLayout()
    }

    override fun onBindViewHolder(
        holder: ViewHolder,
        position: Int,
    ) {
        applyStyle(holder, position)
    }

    override fun getItemCount(): Int = items.size

    fun setItems(data: List<String>) {
        items = data
        notifyDataSetChanged()
    }

    fun setSelectedIndex(index: Int) {
        selectedIndex = index.coerceIn(0, itemCount - 1)
    }

    fun getItem(index: Int): String {
        return items.getOrElse(index) { "" }
    }
}
