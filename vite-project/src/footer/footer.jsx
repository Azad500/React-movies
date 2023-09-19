import { useEffect, useState } from "react";
import styles from "./footer.module.scss";

export function Footer() {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDate(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <p>{date.toString()}</p>
    </div>
  );
}
