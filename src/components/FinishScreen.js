import { useQuiz } from "../context/QuizContext";

function FinishScreen() {
  const { points, maxPossiblePoints, dispatch } = useQuiz();

  return (
    <>
      <p className="result">
        your score <strong>{points}</strong> / {maxPossiblePoints}
      </p>
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "restart" })}
      >
        Restart quiz
      </button>
    </>
  );
}

export default FinishScreen;
