import { createContext, useContext, useReducer, useEffect } from "react";

const QuizContext = createContext();

const SECS_PER_QUESTION = 20;

const initialState = {
  questions: [],

  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  secondsRemaining: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return {
        ...state,
        questions: action.payload,
        status: "ready",
      };
    case "dataFailed":
      return {
        ...state,
        status: "error",
      };
    case "start":
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * SECS_PER_QUESTION,
      };
    case "newAnswer":
      const question = state.questions.at(state.index);

      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };
    case "finish":
      return {
        ...state,
        status: "finished",
      };
    case "restart":
      return { ...initialState, questions: state.questions, status: "ready" };

    case "time":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
      };

    default:
      throw new Error("uncknon action");
  }
}

function QuizProvider({ children }) {
  const [
    { questions, status, index, answer, points, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, initialState);

  const numQuestions = questions.length;

  const maxPossiblePoints = questions.reduce(
    (prev, cur) => prev + cur.points,
    0
  );

  useEffect(function () {
    dispatch({
      type: "dataReceived",
      payload: [
        {
          question: "What is JSX?",
          options: [
            "A JavaScript function",
            "A syntax extension for JavaScript",
            "A CSS preprocessor",
            "A database query language",
          ],
          correctOption: 1,
          points: 10,
        },
        {
          question:
            "Which method in a React Component is called after the component is rendered for the first time?",
          options: [
            "componentDidMount()",
            "componentWillMount()",
            "componentDidUpdate()",
            "componentWillUnmount()",
          ],
          correctOption: 0,
          points: 10,
        },
        {
          question: "What is Redux?",
          options: [
            "A JavaScript library for building user interfaces",
            "A component-based UI development methodology",
            "A predictable state container for JavaScript apps",
            "A server-side rendering framework for React",
          ],
          correctOption: 2,
          points: 10,
        },
        {
          question:
            "In React, what is used to pass data to a component from outside?",
          options: ["setState", "render with arguments", "PropTypes", "props"],
          correctOption: 3,
          points: 10,
        },
        {
          question:
            "Which of the following is the correct way to create a state in a React class component?",
          options: [
            "this.state = {}",
            "state = {}",
            "getState()",
            "this.setState({})",
          ],
          correctOption: 1,
          points: 10,
        },
      ],
    });
  }, []);

  return (
    <QuizContext.Provider
      value={{
        questions,
        status,
        index,
        answer,
        points,

        secondsRemaining,

        numQuestions,
        maxPossiblePoints,

        dispatch,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

function useQuiz() {
  const context = useContext(QuizContext);
  return context;
}

export { QuizProvider, useQuiz };
