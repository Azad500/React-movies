import { Search } from "./Search/search";
import { Create } from "./Create/create";
import styles from "./SearchAndCreate.module.scss";

export function SearchAndCreate({ searchQuery, setSearchQuery }) {
  return (
    <div className={styles.SearchAndCreateContainer}>
      <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <Create />
    </div>
  );
}
