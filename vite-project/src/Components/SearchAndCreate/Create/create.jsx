import React, { useRef, useState } from "react";
import styles from "./create.module.scss";

export function Create() {
  const dialogRef = useRef(null);
  const [moviesImages, setMoviesImages] = useState("");
  const [moviesName, setMoviesName] = useState("");

  function createDialog() {
    if (
      dialogRef.current.style.display === "none" ||
      dialogRef.current.style.display === ""
    ) {
      dialogRef.current.style.display = "flex";
    }
  }

  function cancelDialog(e) {
    if (e) {
      e.preventDefault();
    }
    if (dialogRef.current.style.display === "flex") {
      dialogRef.current.style.display = "none";
    }
  }

  async function saveDialog() {
    try {
      const response = await fetch("http://localhost:3000/movies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Image: moviesImages,
          title: moviesName,
          id: Number,
        }),
      });

      setMoviesImages("");
      setMoviesName("");

      cancelDialog();
    } catch (error) {
      console.error("Error:", error);
    }
  }
  const isSaveButtonDisabled = !moviesImages || !moviesName;
  return (
    <div>
      <button onClick={createDialog}>Create</button>
      <div ref={dialogRef} id={styles.dialog} className={styles.hidden}>
        <form id={styles.dialogContent}>
          <h1>CREATE MOVIES</h1>
          <input
            type="text"
            name="photoLink"
            id="photoLink"
            placeholder="Enter Movie Photo"
            value={moviesImages}
            onChange={(e) => setMoviesImages(e.target.value)}
          />
          <input
            type="text"
            name="filmName"
            id="filmName"
            placeholder="Enter Movie Name"
            value={moviesName}
            onChange={(e) => setMoviesName(e.target.value)}
          />
          <div className={styles.buttonsContainer}>
            <button className={styles.cancelButton} onClick={cancelDialog}>
              Cancel
            </button>
            <button
              className={styles.saveButton}
              onClick={saveDialog}
              disabled={isSaveButtonDisabled}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
