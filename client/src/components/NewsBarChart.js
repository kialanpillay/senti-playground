import React from "react";
import { BarChart, Bar, XAxis, Tooltip } from "recharts";

//Barchart that displays the binned sentiment classification count of a set of news articles
export default function NewsBarChart(props) {
  const data = [
    {
      name: "Sentiment",
      Positive: props.positive,
      Negative: props.negative,
      Neutral: props.neutral,
    },
  ];
  return (
    <BarChart width={180} height={150} data={data}>
      <Tooltip cursor={false} />
      <XAxis hide={true} dataKey="name" />
      <Bar dataKey="Positive" fill="orange" />
      <Bar dataKey="Negative" fill="gray" />
      <Bar dataKey="Neutral" fill="silver" />
    </BarChart>
  );
}
