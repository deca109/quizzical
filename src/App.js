import { React, useState, useEffect } from "react";
import Start from "./Components/Start";
import Quiz from "./Components/Quiz";
import { doc,setDoc,getDoc,updateDoc } from "firebase/firestore";
import {db} from "./firebase"

function App() {
  const [start, setStart] = useState(false);
  const amount = 5;
  const [score, setScore] = useState(
    {
      totalQuestions: 0,
      totalCorrect: 0,
    }
  );
  const [correctPercentage, setCorrectPercentage] = useState(0);
  const scoreRef = doc(db,"scores","userScore");

  async function initializeScore(){
    const scoreSnap= await getDoc(scoreRef);
    if(scoreSnap.exists()){
      const data=scoreSnap.data();
      setScore({
        totalQuestions: data.totalQuestions,
        totalCorrect: data.totalCorrect
      })
    }
    else{
      await setDoc(scoreRef,{
        totalQuestions: 0,
        totalCorrect: 0
      })
    }
  }

  useEffect(()=>{
    initializeScore();
  },[])
  

  async function addQuestions() {
    const updatedTotalQuestions = score.totalQuestions+amount;
    await updateDoc(scoreRef,{
      totalQuestions: updatedTotalQuestions,
    });
    setScore((prevScore)=>{
      return {...prevScore, totalQuestions: updatedTotalQuestions}
    })
  }

  async function addCorrect(currentScore) { 
    const updatedCorrectScore = score.totalCorrect+currentScore
    await updateDoc(scoreRef,{
      totalCorrect: updatedCorrectScore
    })
    setScore((prevScore)=>{
      return {
        ...prevScore,
        totalCorrect: updatedCorrectScore
      }
    })
  }

  useEffect(() => {
    if (score.totalQuestions > 0) {
      setCorrectPercentage(
        Math.ceil((score.totalCorrect / score.totalQuestions) * 100)
      );
    }
  }, [score]);

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
            totalQuestions={score.totalQuestions}
            correctPercentage={correctPercentage}
          />
        )}
      </main>
    </div>
  );
}

export default App;
