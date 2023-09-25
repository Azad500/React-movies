import React, { useRef, useState } from "react";
import styles from "./dialog.module.scss";

export default function Dialog({
  title,
  isSaveButtonDisabled,
  saveDialog,
  dialogRef,
  moviesImages,
  setMoviesImages,
  moviesName,
  setMoviesName,
}) {
  function cancelDialog(e) {
    if (e) {
      e.preventDefault();
    }
    if (dialogRef.current.style.display === "flex") {
      dialogRef.current.style.display = "none";
    }
  }

  return (
    <div ref={dialogRef} id={styles.dialog} className={styles.hidden}>
      <form id={styles.dialogContent}>
        <h1>{title}</h1>
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
  );
}
