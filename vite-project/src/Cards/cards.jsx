import { useEffect, useState } from "react";
import styles from "./cards.module.scss";

export function Cards({ searchQuery }) {
  const [moviess, setMoviess] = useState([]);
  const [editingMovieId, setEditingMovieId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedImage, setEditedImage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage] = useState(8);

  const fetchGet = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/movies?q=${searchQuery}`
      );
      const responseBody = await response.json();
      console.log(responseBody);
      if (responseBody?.length) {
        setMoviess(responseBody);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  useEffect(() => {
    fetchGet();
  }, [searchQuery]);

  const handleDeleteClick = async (movieId) => {
    const shouldDelete = confirm("Are you sure you want to delete this movie?");
    if (shouldDelete) {
      try {
        await fetch(`http://localhost:3000/movies/${movieId}`, {
          method: "DELETE",
        });
        setMoviess((prevMovies) =>
          prevMovies.filter((movie) => movie.id !== movieId)
        );
      } catch (error) {
        console.error("Error deleting movie:", error);
      }
    }
  };

  const handleEditClick = async (moveId, title, Image) => {
    setEditedTitle(title);
    setEditingMovieId(moveId);
    setEditedImage(Image);
  };

  const handleSaveClick = async (movieId) => {
    try {
      await fetch(`http://localhost:3000/movies/${movieId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Image: editedImage, title: editedTitle }),
      });

      setMoviess((prevMovies) =>
        prevMovies.map((movie) =>
          movie.id === movieId ? { ...movie, title: editedTitle } : movie
        )
      );

      setEditingMovieId(null);
    } catch (error) {
      console.error("Error updating movie title:", error);
    }
  };

  //Pagination
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = moviess.slice(indexOfFirstCard, indexOfLastCard);

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
            {editingMovieId === movie.id ? (
              <div className={styles.editContainer}>
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                />
                <button
                  className={styles.saveButton}
                  onClick={() => handleSaveClick(movie.id)}
                >
                  Save
                </button>
              </div>
            ) : (
              <h2>{movie.title}</h2>
            )}
            <div className={styles.buttonsContainer}>
              {editingMovieId !== movie.id && (
                <button
                  className={styles.editButton}
                  onClick={() =>
                    handleEditClick(movie.id, movie.title, movie.Image)
                  }
                >
                  Edit
                </button>
              )}
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
        {Array.from({ length: Math.ceil(moviess.length / cardsPerPage) }).map(
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
