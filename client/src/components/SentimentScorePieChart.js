import React from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

const COLORS = ["orange", "gray", "silver"];

export default function SentimentScorePieChart(props) {
  let data;
  if (props.route === "bayes/") {
    data = [
      {
        name: "Positive",
        value: props.data.classification === "Positive" ? 100 : 0,
      },
      {
        name: "Negative",
        value: props.data.classification === "Positive" ? 0 : 100,
      },
      {
        name: "Neutral",
        value: 0,
      },
    ];
  } else {
    data = [
      {
        name: "Positive",
        value: props.data.pos * 100,
      },
      {
        name: "Negative",
        value: props.data.neg * 100,
      },
      {
        name: "Neutral",
        value: props.data.neu * 100,
      },
    ];
  }

  return (
    <PieChart width={300} height={160}>
      <Tooltip />
      <Pie
        data={data}
        cx={150}
        cy={150}
        label
        labelLine={false}
        outerRadius={100}
        startAngle={180}
        endAngle={0}
        fill="#8884d8"
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
    </PieChart>
  );
}