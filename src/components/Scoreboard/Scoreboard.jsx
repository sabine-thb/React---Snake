import useStore from "../../utils/store";
import s from "./Scoreboard.module.scss";

const Scoreboard = () => {
  const { results, setResults } = useStore();

  const handleDelete = (index) => {
    const newResults = [...results];
    newResults.splice(index, 1); 
    setResults(newResults); 
    localStorage.setItem("results", JSON.stringify(newResults)); // On met à jour le localStorage
  };

  return (
    <div className={s.scoreboard}>
      <h1>Scoreboard</h1>
      <table className={s.results}>
        <thead className={s.header}>
          <tr>
            <th>Name</th>
            <th>Score</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result, i) => (
            <tr className={s.result} key={result.name + i}>
              <td>{result.name}</td>
              <td className={s.score}>{result.score}</td>
              <td>
                <button
                  className={s.delete}
                  onClick={() => handleDelete(i)}
                >
                  <img src="/delete.png" alt="delete" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Scoreboard;
