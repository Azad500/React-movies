import { useEffect, useState } from "react";
import styles from "./footer.module.scss";

export function Footer() {
  const [date, setDate] = useState(new Date()); //date variablesini ekranda gosterir ve new Date durmadan render edir

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDate(new Date());
    }, 1000); //intervalid vasitesile new Date() setDate icinde 1saniyeden 1 render olunur

    return () => clearInterval(intervalId); //arxada durmadan isleyerek doldurmamasi ucun edilir.
  }, []);

  return (
    <div>
      {/* saatida gostermesi ucun toString() yazilir */}
      <p>{date.toString()}</p>
    </div>
  );
}
