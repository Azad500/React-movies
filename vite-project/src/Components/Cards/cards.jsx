import { useEffect, useRef, useState } from "react";
import styles from "./cards.module.scss";

export function Cards({ searchQuery }) {
  const [movies, setMovies] = useState([]); //movies-filmleri ozunde cemlesdirir ve baslangiz deyeri bos []. setMovies ise sonradan deyishiklik etmek ucundur.
  const [editingMovieId, setEditingMovieId] = useState(null);
  const [deleteMovieId, setDeleteMovieId] = useState(null);
  const [moviesImages, setMoviesImages] = useState("");
  const [moviesName, setMoviesName] = useState("");
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); //currentPage filmlerin siyahisinin saxlandigi yerdir default olaraq 1-ci sehifede saxlanilir.
  const [cardsPerPage] = useState(8); //cardsPerPage her sehifede nece eded film olmalidir onu gosterir(8).
  const dialogRef = useRef(null);
  const deleteRef = useRef(null);

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

  const handleDeleteClick = async () => {
    try {
      const movieId = deleteMovieId;
      await fetch(`http://localhost:3000/movies/${movieId}`, {
        method: "DELETE",
      });
      setMovies((prevMovies) =>
        prevMovies.filter((movie) => movie.id !== movieId)
      );
      deleteRef.current.style.display = "none";
    } catch (error) {
      console.error("Error deleting movie:", error);
    }
  };

  const handleDeletedClick = (deleteId, title, Image) => {
    setDeleteMovieId(deleteId);
    setMoviesImages(Image);
    setMoviesName(title);
    deleteRef.current.style.display = "flex";
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
  const indexOfLastCard = currentPage * cardsPerPage; //indexOfLastCard cari səhifədə göstəriləcək son film kartının indeksini hesablayır. Bunu cari səhifəni cardsPerPage-ə vurmaqla edir. Bu, cari səhifədə hansı filmlərin göstəriləcəyini müəyyən etməyə kömək edir.
  const indexOfFirstCard = indexOfLastCard - cardsPerPage; //cari səhifədə göstəriləcək ilk film kartının indeksini hesablayır. Bunu indexOfLastCard-dan cardsPerPage çıxarmaqla edir. Bu, cari səhifədə göstəriləcək filmləri çıxarmaq üçün filmlər massivini dilimləmək üçün istifadə olunur.
  const currentCards = movies.slice(indexOfFirstCard, indexOfLastCard); //cari səhifədə nümayiş etdiriləcək filmləri ehtiva edən yeni massiv yaratmaq üçün dilim metodundan istifadə edir. Hansı filmlərin daxil ediləcəyini müəyyən etmək üçün indexOfFirstCard və indexOfLastCard istifadə edir.

  // Change the page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber); //filmlərin səhifəsini dəyişmək üçün istifadə olunur
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
              {/* ------------------delete---------- */}
              <button
                className={styles.deleteButton}
                onClick={() =>
                  handleDeletedClick(movie.id, movie.title, movie.Image)
                }
              >
                Delete
              </button>
              <div
                ref={deleteRef}
                id={styles.deleteDialogContainer}
                className={styles.hiddenBar}
              >
                <form id={styles.deleteDialogContent}>
                  <h1>DELETE MOVIES</h1>
                  <h2>Are you sure you want to delete this movie?</h2>
                  <div className={styles.buttonsContainers}>
                    <button
                      className={styles.cancelButtonD}
                      onClick={(e) => {
                        e.preventDefault();
                        deleteRef.current.style.display = "none";
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      className={styles.deleteButtonD}
                      onClick={() => handleDeleteClick(movie.id)}
                    >
                      Delete
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      ))}
      {/* Pagination buttons */}
      <div className={styles.pagination}>
        {/* fimlerin uzunlugunu kartlarin sayina bolub yuvarlaqlasdirib mueyyen edirik ve map funksiyasi vasitesile render edirik */}
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
