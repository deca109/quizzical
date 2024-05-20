import React, { useState, useEffect } from "react";
import Confetti from 'react-confetti';


export default function Quiz({amount,addQuestions,addCorrect}) {
  const apiUrl = `https://opentdb.com/api.php?amount=${amount}&difficulty=easy&type=multiple`;
  const [trivia, setTrivia] = useState([]);
  const [userAns, setUserAns] = useState(Array(amount).fill(""));
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [correctAns, setCorrectAns] = useState([]);
  const [score, setScore] = useState(0);
  const [submit, setSubmit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toggleReset,setToggleReset]=useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        setTrivia(data.results);
        setShuffledOptions(
          data.results.map((item) =>
            shuffleOptions([...item.incorrect_answers, item.correct_answer])
          )
        );
        setCorrectAns(data.results.map((item) => item.correct_answer));
        setLoading(false);
      });
      addQuestions();
  }, [toggleReset]);

  const shuffleOptions = (options) => {
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.ceil(Math.random() * i);
      [options[i], options[j]] = [options[j], options[i]];
    }
    return options;
  };

  const optionClick = (idx, option) => {
    if (!submit) {
      setUserAns((prevUserAns) => {
        const newUserAns = [...prevUserAns];
        newUserAns[idx] = option;
        return newUserAns;
      });
    }
  };

  // useEffect(() => {
  //   console.log(userAns);
  //   console.log(correctAns);
  //   // eslint-disable-next-line
  // }, [userAns]);

  const triviaElements = trivia.map((item, idx) => {
    const decodeEntities = (html) => {
      const txt = document.createElement("textarea");
      txt.innerHTML = html;
      return txt.value;
    };

    const options = shuffledOptions[idx];

    return (
      <div key={idx} className="trivia-container">
        <h2 className="trivia-question">{decodeEntities(item.question)}</h2>
        <div className="option-container">
          {options.map((optionItem, optionIdx) => {
            return (
              <button
                key={optionIdx}
                className={
                  `option question-${idx + 1} ` + (submit ? "disable" : "")
                }
                onClick={() => optionClick(idx, optionItem)}
                style={
                  submit
                    ? {
                        opacity: correctAns.includes(optionItem) && correctAns.indexOf(optionItem)===idx? 1 : 0.5,
                        backgroundColor: userAns.includes(optionItem)
                          ? optionItem === correctAns[idx]
                            ? "#94D7A2"
                            : "#F8BCBC"
                          : correctAns.includes(optionItem) && correctAns.indexOf(optionItem)===idx
                          ? "#94D7A2"
                          : "white",
                      }
                    : {
                        backgroundColor: userAns.includes(optionItem) && userAns.indexOf(optionItem)===idx
                          ? "#D6DBF5"
                          : "white",
                      }
                }
              >
                {decodeEntities(optionItem)}
              </button>
            );
          })}
        </div>
        <hr style={{ opacity: 0.7 }} />
      </div>
    );
  });

  function handleSubmit() {
    setSubmit(true);
    for (let i = 0; i < amount; i++) {
      if (userAns[i] === correctAns[i])
        setScore((prevScore) => {
          return prevScore + 1;
        });
    }
  }

  function addCorrectScores(){
    addCorrect(score);
  }

  useEffect(()=>{
    addCorrectScores();
  },[score])

  function handleReset() {
    setSubmit(false);
    setScore(0);
    setUserAns(Array(amount).fill(""));
    setToggleReset(!toggleReset);
  }

  return (
    <>
      {loading ? (
        <div className="loading-container">
          <p className="loading-screen">Loading...</p>
        </div>
      ) : (
        <div className="quiz-container">
          {submit && score===amount && <Confetti/>}
          {triviaElements}
          <div className="result">
            {!submit ? (
              <button className="submit" onClick={handleSubmit}>
                Check Answers
              </button>
            ) : (
              <div>
                <p>
                  You scored {score}/{amount} correct answers
                </p>
                <button className="submit" onClick={handleReset}>
                  Play Again
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
