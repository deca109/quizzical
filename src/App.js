import { React, useState, useEffect } from "react";
import Start from "./Components/Start";
import Quiz from "./Components/Quiz";

function App() {
  const [start, setStart] = useState(false);
  const amount = 5;
  const [totalQuestions, setTotalQuestions] = useState(
    JSON.parse(localStorage.getItem("total-questions")) || 0
  );
  const [totalCorrect, setTotalCorrect] = useState(JSON.parse(localStorage.getItem("total-correct")) || 0) ;
  const [correctPercentage, setCorrectPercentage] = useState(0);

  function addQuestions() {
    setTotalQuestions((prevQ) => prevQ + amount);
  }

  function addCorrect(currentScore) {
    setTotalCorrect((prevCorrect) => prevCorrect + currentScore);
  }

  useEffect(() => {
    localStorage.setItem("total-questions", totalQuestions);
    console.log(totalQuestions);
  }, [totalQuestions]);

  useEffect(() => {
    localStorage.setItem("total-correct",totalCorrect);
    console.log(totalCorrect);
  }, [totalCorrect]);

  useEffect(() => {
    if (totalQuestions > 0) {
      setCorrectPercentage(Math.ceil(totalCorrect / totalQuestions * 100));
    }
  }, [totalCorrect]);

  return (
    <div className="container">
      <div className="circle top-right"></div>
      <div className="circle bottom-left"></div>
      <main>
        {start ? (
          <Quiz
            amount={amount}
            addQuestions={addQuestions}
            addCorrect={addCorrect}
          />
        ) : (
          <Start
            handleClick={() => {
              setStart(true);
            }}
            totalQuestions={totalQuestions}
            correctPercentage={correctPercentage}
          />
        )}
      </main>
    </div>
  );
}

export default App;
