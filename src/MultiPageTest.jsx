import React, { useState, useEffect } from "react";
import styled, { createGlobalStyle } from "styled-components";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, ChartTitle, Tooltip, Legend);

const baseUrl = "https://hangeulbucket.s3.ap-northeast-2.amazonaws.com";

const characterDescriptions = {
  boxer: {
    title: "복싱 미기",
    description: `당신은 문제 상황에서 망설임 없이 도전하는 추진력을 가지고 있습니다.
프로젝트 진행 중 갑작스런 버그나 오류가 발생하면, 먼저 나서서 해결 방안을 모색하며 팀에 활력을 불어넣습니다.
어색한 상황에서도 먼저 말을 걸어 동료들과 소통하며, 주변 사람들을 즐겁게 만드는 성격이에요.`,
    image: baseUrl + "/boxing.png",
  },
  basic: {
    title: "기본 미기",
    description: `당신은 체계적이고 안정적인 기반을 다지는 데 탁월합니다.
코드를 꼼꼼하게 작성하고, 강의나 회의에서 집중하며 고개를 끄덕이는 모습을 보입니다.
항상 조화와 균형을 중시해 팀의 든든한 버팀목 역할을 하며, 동료들이 안정감을 느낄 수 있게 도와줘요.`,
    image: baseUrl + "/default.png",
  },
  earphone: {
    title: "이어폰 미기",
    description: `당신은 창의적인 아이디어와 활발한 소통으로 팀의 분위기를 혁신합니다.
새로운 사람들과의 만남을 즐기고, 동료들의 감정을 세심하게 이해해 자연스럽게 공감하는 능력이 뛰어나요.
다양한 관점에서 문제를 바라보며, 협업에 신선한 에너지를 불어넣습니다.`,
    image: baseUrl + "/earphone.png",
  },
  grad: {
    title: "졸업생 미기",
    description: `당신은 풍부한 경험과 깊은 통찰로 팀의 방향을 제시하는 든든한 멘토입니다.
동료들의 기분을 세심하게 살피며, 필요할 때는 자신의 시간을 아끼지 않고 도와줍니다.
온화한 마음과 자기희생적인 태도로 모두가 함께 성장할 수 있는 환경을 만들어줘요.`,
    image: baseUrl + "/graduate.png",
  },
  burger: {
    title: "햄버거 미기",
    description: `당신은 밝고 유쾌한 에너지로 팀 분위기를 환기시키는 소셜 리더입니다.
새로운 사람들과의 만남을 즐기며, 동료들에게 긍정적인 기운을 전달해 모두를 행복하게 만듭니다.
언제나 먼저 다가가 즐겁게 대화를 이끌어가는 따뜻한 성격이에요.`,
    image: baseUrl + "/hamburger.png",
  },
  hoodie: {
    title: "후드 티 미기",
    description: `당신은 섬세한 감각과 예술적인 시각으로 디자인 및 사용자 경험 개선에 큰 기여를 합니다.
동료들의 기분을 배려하며, 조용하지만 확실한 영향력으로 팀의 분위기를 부드럽게 만듭니다.
불필요한 갈등은 피하고, 필요한 때 부드럽게 소통해 문제를 원만하게 해결하는 능력이 돋보여요.`,
    image: baseUrl + "/hoody.png",
  },
  wizard: {
    title: "마법사 미기",
    description: `당신은 복잡한 문제를 창의적으로 해결하는 혁신가입니다.
프로젝트의 어려운 상황에서도 미래를 내다보고 전략적인 접근으로 새로운 솔루션을 제시합니다.
동료들에게 항상 새로운 영감을 주며, 팀 전체를 한 단계 업그레이드하는 역할을 합니다.`,
    image: baseUrl + "/magician.png",
  },
  scarf: {
    title: "목도리 미기",
    description: `당신은 따뜻한 배려와 세심한 소통으로 팀 내 조화로운 분위기를 만드는 역할을 합니다.
다른 사람이 상처받지 않도록 신중하게 대화를 이끌며, 겉으로는 감정을 드러내지 않지만 내면에는 깊은 배려심이 자리해요.
균형과 조화를 중요하게 여겨 모두가 편안하게 의견을 나눌 수 있는 환경을 조성합니다.`,
    image: baseUrl + "/muffler.png",
  },
  study: {
    title: "공부 미기",
    description: `당신은 깊이 있는 분석력과 끊임없는 학구열로 기술적 문제를 해결하는 데 앞장섭니다.
강의나 세미나에서 집중하여 고개를 끄덕이며 새로운 지식을 흡수하고, 최신 기술 트렌드를 빠르게 습득합니다.
미래에 대한 걱정도 있지만, 그만큼 문제의 본질을 이해하려는 열정이 팀의 혁신을 이끌어요.`,
    image: baseUrl + "/study.png",
  },
};

const characterMatches = {
  boxer: ["wizard", "burger"],
  basic: ["study", "scarf"],
  earphone: ["burger", "hoodie"],
  grad: ["study", "basic"],
  burger: ["earphone", "wizard"],
  hoodie: ["earphone", "scarf"],
  wizard: ["boxer", "burger"],
  scarf: ["basic", "hoodie"],
  study: ["basic", "grad"],
};

const questionPages = [
  {
    questions: [
      {
        question: "1. 대학 생활 중! 아는 사람은 없는데 함께할 사람이 필요해. 그럴 때 나는?",
        options: [
          { text: "커뮤니티에 직접 구하는 글을 올려봐야지~", value: "boxer" },
          { text: "구하는 글에 신청 댓글 달아보자!", value: "scarf" },
          { text: "될대로 돼라~! 안해버리기.", value: "hoodie" },
        ],
      },
      {
        question: "2. 커뮤니티에서 사람 구하고 싶은데 때문에 너무 힘들어 ㅜㅅㅜ",
        options: [
          { text: "상대에 대한 정보 부족", value: "study" },
          { text: "많은 정보가 분산되어 원하는 정보를 찾기 어려움", value: "grad" },
          { text: "익명 기반으로 신뢰성이 부족함", value: "scarf" },
        ],
      },
      {
        question: "3. 나는 사람을 구할 때 을 가장 먼저 고려해!",
        options: [
          { text: "성별", value: "burger" },
          { text: "나이 / 학번", value: "study" },
          { text: "성격 (mbti) / 취미", value: "earphone" },
        ],
      },
    ],
  },
  {
    questions: [
      {
        question: "4. 오늘은 UMC 데모데이야! 나는 가자마자~",
        options: [
          { text: "가장 인기 많은 부스부터 봐야겠다!", value: "boxer" },
          { text: "천천히 둘러보면서 관심 가는 부스부터 봐야지~", value: "wizard" },
          { text: "푸드 트럭과 이벤트부터 먼저 조진다.", value: "burger" },
        ],
      },
      {
        question: "5. 이 부스 가봐야겠다! 나는 이 부스에서",
        options: [
          { text: "먼저 설명을 듣고 어떤 서비스인지 파악해야지.", value: "study" },
          { text: "설명이 담긴 엑스배너부터 조용히 읽어봐야겠다.", value: "hoodie" },
          { text: "이 팀의 분위기는 어떤지 확인해봐야지.", value: "scarf" },
        ],
      },
      {
        question: "6. 데모데이 끝나고 집으로 가는 길, 나는…",
        options: [
          { text: "다음 UMC에 꼭 참여해야지!", value: "boxer" },
          { text: "이게 뭐지?", value: "wizard" },
          { text: "피곤해 얼른 집에 가고 싶어..", value: "basic" },
        ],
      },
    ],
  },
];

/* 전역 스타일 설정 */
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background: #f0faff;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    color: #333;
  }
`;

/* 테마 색상 */
const primaryColor = "#1e90ff";
const secondaryColor = "#87ceeb";

/* 반응형 Container 스타일 */
const Container = styled.div`
  width: 90%;
  max-width: 600px;
  margin: 50px auto;
  padding: 30px;
  background: #ffffff;
  border: 1px solid ${secondaryColor};
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);

  @media (min-width: 768px) {
    width: 70%;
    max-width: 800px;
  }

  @media (min-width: 1024px) {
    width: 60%;
    max-width: 1000px;
  }
`;

/* 타이틀 스타일 */
const Title = styled.h1`
  text-align: center;
  color: ${primaryColor};
  margin-bottom: 20px;
`;

/* 질문 타이틀 */
const QuestionTitle = styled.h2`
  font-size: 1.2rem;
  margin-bottom: 16px;
  color: ${primaryColor};
`;

/* 옵션 버튼 */
const OptionButton = styled.button`
  width: 100%;
  padding: 14px 20px;
  margin: 8px 0;
  border: 2px solid ${secondaryColor};
  border-radius: 8px;
  background-color: ${(props) => (props.selected ? secondaryColor : "#ffffff")};
  color: ${(props) => (props.selected ? "#ffffff" : primaryColor)};
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s, border-color 0.3s;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &:hover {
    background-color: ${(props) => (props.selected ? primaryColor : "#e6f7ff")};
  }
`;

/* 버튼 스타일 (다음, 결과, 통계 등) */
const NextButton = styled.button`
  margin-top: 20px;
  padding: 14px 28px;
  background-color: ${secondaryColor};
  border: none;
  border-radius: 8px;
  color: #ffffff;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background-color: ${primaryColor};
  }
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const RestartButton = styled.button`
  margin-top: 20px;
  margin-right: 40px;
  padding: 14px 28px;
  background-color: ${secondaryColor};
  border: none;
  border-radius: 8px;
  color: #ffffff;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background-color: ${primaryColor};
  }
`;

const StatsButton = styled.button`
  margin-top: 20px;
  padding: 14px 28px;
  background-color: ${secondaryColor};
  border: none;
  border-radius: 8px;
  color: #ffffff;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background-color: ${primaryColor};
  }
`;

const Progress = styled.div`
  margin-top: 20px;
  font-size: 0.9rem;
  color: #555;
  text-align: right;
`;

const ResultText = styled.div`
  text-align: center;
  margin-top: 20px;
`;

const ResultImage = styled.img`
  display: block;
  margin: 20px auto;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 3px solid ${secondaryColor};

  @media (min-width: 768px) {
    width: 180px;
    height: 180px;
  }
`;

const MatchContainer = styled.div`
  margin-top: 30px;
  text-align: center;
`;

const MatchItem = styled.div`
  display: inline-block;
  margin: 0 10px;
`;

const MatchImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: block;
  margin: 0 auto 5px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 20px;
`;

/* 시작 화면 스타일 */
const SplashContainer = styled(Container)`
  height: 100vh;
  background: linear-gradient(135deg, #ffffff, #e0f7ff);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0;
  border: none;
  box-shadow: none;
`;

const StartButton = styled.button`
  margin-top: 20px;
  padding: 16px 32px;
  background-color: ${secondaryColor};
  border: none;
  border-radius: 8px;
  color: #ffffff;
  font-size: 1.3rem;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background-color: ${primaryColor};
  }
`;

const LogoImage = styled.img`
  width: 360px;
  height: auto;
  max-width: 100%;
  display: block;
  margin: 0 auto;
`;

const StartScreen = ({ onStart }) => {
  return (
    <SplashContainer>
      <img
        src="https://hangeulbucket.s3.ap-northeast-2.amazonaws.com/default.png"
        alt="Splash"
        style={{ maxWidth: "80%", height: "auto", borderRadius: "8px" }}
      />
      <StartButton onClick={onStart}>시작하기</StartButton>
    </SplashContainer>
  );
};

const StatisticsPage = ({ onBack }) => {
  const [stats, setStats] = useState({});

  useEffect(() => {
    const data = localStorage.getItem("testResults");
    let results = data ? JSON.parse(data) : [];
    const counts = results.reduce((acc, curr) => {
      acc[curr] = (acc[curr] || 0) + 1;
      return acc;
    }, {});
    setStats(counts);
  }, []);

  const labels = Object.keys(characterDescriptions).map(
    (key) => characterDescriptions[key].title
  );
  const dataCounts = Object.keys(characterDescriptions).map(
    (key) => stats[key] || 0
  );

  const data = {
    labels,
    datasets: [
      {
        label: "응답 수",
        data: dataCounts,
        backgroundColor: "rgba(135, 206, 235, 0.5)",
        borderColor: "rgba(135, 206, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "성향별 테스트 응답 통계",
      },
    },
  };

  return (
    <Container>
      <Title>테스트 통계</Title>
      {labels.some((_, idx) => dataCounts[idx] > 0) ? (
        <Bar data={data} options={options} />
      ) : (
        <p>아직 테스트 응답이 없습니다.</p>
      )}
      <RestartButton onClick={onBack}>돌아가기</RestartButton>
    </Container>
  );
};

export default function MultiPageTest() {
  const [startTest, setStartTest] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [computedResult, setComputedResult] = useState(null);

  const handleOptionClick = (pageIndex, questionIndex, value) => {
    const newAnswers = [...answers];
    const answerIndex = newAnswers.findIndex(
      (ans) => ans.page === pageIndex && ans.qIndex === questionIndex
    );
    if (answerIndex >= 0) {
      newAnswers[answerIndex].value = value;
    } else {
      newAnswers.push({ page: pageIndex, qIndex: questionIndex, value });
    }
    setAnswers(newAnswers);
  };

  const isPageAnswered = () => {
    const pageAnswers = answers.filter((ans) => ans.page === currentPage);
    return pageAnswers.length === questionPages[currentPage].questions.length;
  };

  const computeResult = () => {
    const allValues = answers.map((ans) => ans.value);
    const freqMap = {};
    allValues.forEach((val) => {
      freqMap[val] = (freqMap[val] || 0) + 1;
    });
    const maxCount = Math.max(...Object.values(freqMap));
    const candidates = Object.keys(freqMap).filter(
      (val) => freqMap[val] === maxCount
    );
    const chosen =
      candidates[Math.floor(Math.random() * candidates.length)];
    return { type: chosen, data: characterDescriptions[chosen] };
  };

  const storeTestResult = (resultType) => {
    const data = localStorage.getItem("testResults");
    let results = data ? JSON.parse(data) : [];
    results.push(resultType);
    localStorage.setItem("testResults", JSON.stringify(results));
  };

  const handleNextPage = () => {
    if (currentPage < questionPages.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      const computed = computeResult();
      storeTestResult(computed.type);
      setComputedResult(computed);
      setShowResult(true);
    }
  };

  const handleRestart = () => {
    setCurrentPage(0);
    setAnswers([]);
    setShowResult(false);
    setShowStats(false);
    setComputedResult(null);
  };


  if (showResult) {
    if (showStats) {
      return (
        <>
          <GlobalStyle />
          <StatisticsPage onBack={() => setShowStats(false)} />
        </>
      );
    }
    const matchingKeys = characterMatches[computedResult.type] || [];
    const matchingCharacters = matchingKeys.map(
      (key) => characterDescriptions[key]
    );

    return (
      <>
        <GlobalStyle />
        <Container>
          <Title>결과</Title>
          <ResultImage
            src={computedResult.data.image}
            alt={computedResult.data.title}
          />
          <ResultText>
            <h2>{computedResult.data.title}</h2>
            <p>{computedResult.data.description}</p>
          </ResultText>
          <MatchContainer>
            <h3>당신과 잘 맞는 캐릭터</h3>
            {matchingCharacters.map((char, idx) => (
              <MatchItem key={idx}>
                <MatchImage src={char.image} alt={char.title} />
                <div>{char.title}</div>
              </MatchItem>
            ))}
          </MatchContainer>
          <ButtonContainer>
            <NextButton onClick={handleRestart}>테스트 다시하기</NextButton>
            <StatsButton onClick={() => setShowStats(true)}>
              통계 보기
            </StatsButton>
          </ButtonContainer>
        </Container>
      </>
    );
  }

  const currentQuestions = questionPages[currentPage].questions;
  return (
    <>
      <GlobalStyle />
      <Container>
        <LogoImage src = "https://hangeulbucket.s3.ap-northeast-2.amazonaws.com/logo.png"></LogoImage>
        <Title>MEET PICK 당신과 어울리는 미기는?</Title>
        {currentQuestions.map((q, qIndex) => {
          const pageAnswer = answers.find(
            (ans) => ans.page === currentPage && ans.qIndex === qIndex
          );
          return (
            <div key={qIndex}>
              <QuestionTitle>{q.question}</QuestionTitle>
              {q.options.map((opt, optIndex) => {
                const isSelected = pageAnswer && pageAnswer.value === opt.value;
                return (
                  <OptionButton
                    key={optIndex}
                    onClick={() =>
                      handleOptionClick(currentPage, qIndex, opt.value)
                    }
                    selected={isSelected}
                  >
                    <span>{opt.text}</span>
                    {isSelected && <span>✔</span>}
                  </OptionButton>
                );
              })}
            </div>
          );
        })}
        <Progress>
          {currentPage + 1} / {questionPages.length} 페이지
        </Progress>
        <NextButton onClick={handleNextPage} disabled={!isPageAnswered()}>
          {currentPage === questionPages.length - 1 ? "결과 보기" : "다음 페이지"}
        </NextButton>
      </Container>
    </>
  );
}
