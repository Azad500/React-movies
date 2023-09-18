import { SearchAndCreate } from "../SearchAndCreate/searchAndCreate";
import { Cards } from "../Cards/cards";
import { useState } from "react";
import styles from "./main.module.scss";

export function Main() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <section>
      <SearchAndCreate
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <Cards searchQuery={searchQuery} />
    </section>
  );
}
