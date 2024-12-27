import { useEffect } from "react";
import { useState } from "react";
import useStore from "../../utils/store";
import s from "./Submit.module.scss";

const Submit = ({ score, death, setHasEnteredResults }) => {
  const [name, setName] = useState("");
  const { setResults } = useStore();

  useEffect(() => {
    let results = localStorage.getItem("results");
    results = JSON.parse(results);

    if (results) {
      setResults(results);
    }
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();

    let results = localStorage.getItem("results");
    results = JSON.parse(results);

    if (results === null) {

      results = [
        {
          name: name,
          score: score,
          death: death,
        },
      ];
    } else {

      results.push({
        name: name,
        score: score,
        death: death,
      });
    }

    // On trie les résultats par score du plus grand au plus petit
    results.sort((a, b) => b.score - a.score);
    localStorage.setItem("results", JSON.stringify(results));
    setResults(results);
    setHasEnteredResults(true);
  };

  return (
    <form className={s.form} onSubmit={onSubmit}>
      <label htmlFor="name">Your name :</label>
      <input
        type="text"
        value={name}
        id="name"
        onChange={(e) => setName(e.target.value)}
      />
    </form>
  );
};

export default Submit;
