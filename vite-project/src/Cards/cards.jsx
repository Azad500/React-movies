import { useEffect, useRef, useState } from "react";
import styles from "./cards.module.scss";

export function Cards({ searchQuery }) {
  const [movies, setMovies] = useState([]);
  const [editingMovieId, setEditingMovieId] = useState(null);
  const [moviesImages, setMoviesImages] = useState("");
  const [moviesName, setMoviesName] = useState("");
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage] = useState(8);
  const dialogRef = useRef(null);

  useEffect(() => {
    setCurrentPage(1);
    fetchMovies();
  }, [searchQuery]);

  const fetchMovies = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/movies?q=${searchQuery}`
      );
      const responseBody = await response.json();
      if (responseBody?.length) {
        setMovies(responseBody);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  const handleDeleteClick = async (movieId) => {
    const shouldDelete = confirm("Are you sure you want to delete this movie?");
    if (shouldDelete) {
      try {
        await fetch(`http://localhost:3000/movies/${movieId}`, {
          method: "DELETE",
        });
        setMovies((prevMovies) =>
          prevMovies.filter((movie) => movie.id !== movieId)
        );
      } catch (error) {
        console.error("Error deleting movie:", error);
      }
    }
  };

  const handleEditClick = async (movieId, title, Image) => {
    setEditingMovieId(movieId);
    setMoviesImages(Image);
    setMoviesName(title);
    setIsSaveButtonDisabled(true);
    dialogRef.current.style.display = "flex";
  };

  const saveDialog = async () => {
    try {
      const movieId = editingMovieId;
      await fetch(`http://localhost:3000/movies/${movieId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Image: moviesImages, title: moviesName }),
      });
      setMovies((prevMovies) =>
        prevMovies.map((movie) =>
          movie.id === movieId
            ? { ...movie, title: moviesName, Image: moviesImages }
            : movie
        )
      );
      dialogRef.current.style.display = "none";
    } catch (error) {
      console.error("Error updating movie:", error);
    }
  };

  // Pagination
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = movies.slice(indexOfFirstCard, indexOfLastCard);

  // Change the page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <section className={styles.section}>
      {currentCards.map((movie) => (
        <div key={movie.id} className={styles.cardsContainer}>
          <div className={styles.card}>
            <img src={movie.Image} alt={movie.title} />
            <h2>{movie.title}</h2>
            <div className={styles.buttonsContainer}>
              {/* ---------editButton--------- */}
              <button
                className={styles.editButton}
                onClick={() =>
                  handleEditClick(movie.id, movie.title, movie.Image)
                }
              >
                Edit
              </button>
              <div ref={dialogRef} id={styles.dialog} className={styles.hidden}>
                <form id={styles.dialogContent}>
                  <h1>EDITED MOVIES</h1>
                  <input
                    type="text"
                    name="photoLink"
                    id="photoLink"
                    placeholder="Enter Movie Photo"
                    value={moviesImages}
                    onChange={(e) => {
                      setMoviesImages(e.target.value);
                      setIsSaveButtonDisabled(false);
                    }}
                  />
                  <input
                    type="text"
                    name="filmName"
                    id="filmName"
                    placeholder="Enter Movie Name"
                    value={moviesName}
                    onChange={(e) => {
                      setMoviesName(e.target.value);
                      setIsSaveButtonDisabled(false);
                    }}
                  />
                  <div className={styles.buttonsContainer}>
                    <button
                      className={styles.cancelButton}
                      onClick={(e) => {
                        e.preventDefault();
                        dialogRef.current.style.display = "none";
                      }}
                    >
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
              <button
                className={styles.deleteButton}
                onClick={() => handleDeleteClick(movie.id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
      {/* Pagination buttons */}
      <div className={styles.pagination}>
        {Array.from({ length: Math.ceil(movies.length / cardsPerPage) }).map(
          (_, index) => (
            <button
              key={index}
              className={`${styles.pageButton} ${
                currentPage === index + 1 ? styles.currentPage : ""
              }`}
              onClick={() => paginate(index + 1)}
            >
              {index + 1}
            </button>
          )
        )}
      </div>
    </section>
  );
}
