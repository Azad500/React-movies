import styles from "./search.module.scss";

export function Search({ searchQuery, setSearchQuery }) {
  const handleChange = (e) => {
    const { value } = e.target;
    setSearchQuery(value);
  };

  return (
    <div>
      <input
        type="search"
        name="search"
        id="search"
        placeholder="Enter Movies' Name"
        onChange={handleChange}
        value={searchQuery}
      />
    </div>
  );
}
