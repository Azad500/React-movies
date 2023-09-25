import React, { useRef, useState } from "react";
import styles from "./create.module.scss";
import Dialog from "../../Dialog/dialog";

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
      <Dialog
        title={"CREATE MOVIES"}
        isSaveButtonDisabled={isSaveButtonDisabled}
        saveDialog={saveDialog}
        dialogRef={dialogRef}
        moviesImages={moviesImages}
        setMoviesImages={setMoviesImages}
        moviesName={moviesName}
        setMoviesName={setMoviesName}
      />
    </div>
  );
}
