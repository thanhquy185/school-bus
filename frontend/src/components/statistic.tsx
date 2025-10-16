import { type CSSProperties, type ReactNode } from "react";
import { Statistic } from "antd";

type CustomStatisticProps = {
  title?: string;
  value?: number;
  precision?: number;
  color?: string;
  bgColorDiff?: string;
  fgColorDiff?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
  style?: CSSProperties | undefined;
};

const CustomStatistic: React.FC<CustomStatisticProps> = ({
  title,
  value,
  precision = 0,
  color,
  bgColorDiff,
  fgColorDiff,
  prefix = "",
  suffix = "",
  style = {},
}) => {
  return (
    <div
      style={{
        backgroundColor: bgColorDiff ? bgColorDiff : color,
        ...style,
      }}
      className="statistic"
    >
      <Statistic
        title={<span style={{ color: "#eaeaea" }}>{title}</span>}
        value={value}
        precision={precision}
        prefix={prefix}
        suffix={suffix}
        valueStyle={{ color: fgColorDiff ? fgColorDiff : "white" }}
      />
    </div>
  );
};

export default CustomStatistic;
