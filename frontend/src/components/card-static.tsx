import type { CSSProperties, ReactNode } from "react";
import CountUp from "react-countup";
import { Card, Statistic } from "antd";

type CardStaticProps = {
  variant?: "borderless" | "outlined" | undefined;
  id?: string;
  className?: string;
  title?: string;
  value?: number;
  otherValue?: number;
  precision?: number;
  valueStyle?: CSSProperties | undefined;
  prefix?: ReactNode;
  suffix?: ReactNode;
  separator?: string;
};

const CardStatic: React.FC<CardStaticProps> = ({
  variant,
  id,
  className,
  title,
  value = 0,
  otherValue,
  precision,
  valueStyle,
  prefix,
  suffix,
  separator = "",
}) => {
  return (
    <Card variant={variant} id={id} className={className}>
      <Statistic
        title={title}
        value={value}
        precision={precision}
        // valueRender={() => (
        //   <CountUp
        //     end={value}
        //     decimals={precision}
        //     duration={1.5}
        //     separator=","
        //   />
        // )}
        valueRender={() => (
          <span
            style={{
              ...valueStyle,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "block",
              maxWidth: "100%",
            }}
            title={value?.toLocaleString()}
          >
            <span style={{ marginRight: 4 }}>{prefix}</span>
            <CountUp
              end={value}
              decimals={precision}
              separator={separator}
              duration={1.5}
            />
            <span>{suffix}</span>
            {otherValue && (
              <CountUp
                end={otherValue}
                decimals={precision}
                separator=""
                duration={1.5}
              />
            )}
          </span>
        )}
        valueStyle={valueStyle}
        // prefix={prefix}
        // suffix={suffix}
      />
    </Card>
  );
};

export default CardStatic;
