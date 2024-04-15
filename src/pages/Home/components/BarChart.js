import { useEffect, useRef } from "react";
import * as echarts from "echarts";

const BarChart = ({ title }) => {
  const chartRef = useRef(null);
  useEffect(() => {
    // 1. 生成实例
    const myChart = echarts.init(chartRef.current);
    // 2. 准备图表参数
    const option = {
      title: {
        text: title,
      },
      xAxis: {
        type: "category",
        data: ["vue", "react", "Angular"],
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: [10, 40, 70],
          type: "bar",
        },
      ],
    };
    // 3. 渲染参数
    myChart.setOption(option);
  }, [title]);
  return <div ref={chartRef} style={{ width: "500px", height: "400px" }} />;
};

export default BarChart;
