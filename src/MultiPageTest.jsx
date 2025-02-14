import React, { useState, useEffect } from "react";
import styled from "styled-components";
// Chart.js 관련 import
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

// Chart.js 컴포넌트 등록
ChartJS.register(CategoryScale, LinearScale, BarElement, ChartTitle, Tooltip, Legend);

//
// 1. 테스트 질문 데이터 (총 12문항, 3페이지)
// 각 질문의 옵션은 9가지 성향 중 하나의 결과 값(value)로 매핑됩니다.
//
const questionPages = [
  {
    questions: [
      {
        question: "1. 오늘 UMC 데모데이에 도착한 당신은?",
        options: [
          { text: "부스들부터 재빨리 탐색한다", value: "boxer" },
          { text: "행사장을 천천히 둘러보며 정보를 수집한다", value: "basic" },
          { text: "푸드 트럭부터 먼저 조진다", value: "earphone" },
          { text: "부스 발표 잘 못하면 어떡하지 걱정한다", value: "grad" },
        ],
      },
      {
        question: "2. 데모데이 전, 당신의 준비 비법은?",
        options: [
          { text: "세부 자료부터 척척 살핀다", value: "study" },
          { text: "핵심 내용만 쏙 정리해둔다", value: "hoodie" },
          { text: "팀원들과 수다 떨며 아이디어 쏟아낸다", value: "burger" },
          { text: "머릿속에서 번뜩이는 발상이 터진다", value: "wizard" },
        ],
      },
      {
        question: "3. 오늘은 데모데이 전날, 당신은?",
        options: [
          { text: "마지막까지 기능 테스트를 돌려보며 안정성을 점검한다", value: "boxer" },
          { text: "준비 체크리스트를 보며 빠진 부분이 없는지 확인한다", value: "basic" },
          { text: "일단 잠부터 자고 컨디션을 최우선으로 챙긴다", value: "earphone" },
          { text: "지난 프로젝트 경험을 떠올리며 개선할 점을 정리한다", value: "grad" },
        ],
      },
      {
        question: "4. 첫 회의 후 회식자리에서 당신은?",
  options: [
    { text: "처음 보는 사람들과도 적극적으로 어울리며 분위기를 주도한다", value: "boxer" },
    { text: "조용히 팀원들 옆에 앉아 분위기를 살핀다", value: "basic" },
    { text: "잼얘로 모두를 즐겁게 한다", value: "earphone" },
    { text: "한쪽에서 차분히 대화를 나누며 앞으로 뭐 먹고 살지 얘기한다", value: "grad" },
  ],
      },
    ],
  },
  {
    questions: [
      {
        question: "5. 첫 프로젝트 회의, 당신의 포지션은?",
        options: [
          { text: "모든 걸 주도하며 분위기를 이끈다", value: "boxer" },
          { text: "필요한 정보를 깔끔하게 정리해 발표한다", value: "basic" },
          { text: "동료들을 격려하며 긍정 에너지 뿜뿜", value: "scarf" },
          { text: "혁신적인 아이디어로 모두를 놀라게 한다", value: "wizard" },
        ],
      },
      {
        question: "6. 프로젝트에서 예상치 못한 버그가 발생했다! 당신은?",
        options: [
          { text: "깊게 파고들며 원인을 철저히 분석한다", value: "study" },
          { text: "핵심 원인을 빠르게 파악하고 해결책을 찾는다", value: "hoodie" },
          { text: "팀원들과 머리 맞대며 해결 방안을 모색한다", value: "burger" },
          { text: "GPT부터 돌려보고 힌트를 얻는다", value: "earphone" },
        ],
      },      
      {
        question: "7. 회의 중 의견 충돌, 당신의 대응은?",
        options: [
          { text: "무조건 내가 맞아", value: "boxer" },
          { text: "침착하게 중재하며 상황을 수습한다", value: "basic" },
          { text: "새로운 관점으로 문제를 재해석한다", value: "earphone" },
          { text: "과거 사례를 들어 논리적으로 설명한다", value: "grad" },
        ],
      },
      {
        question: "8. 회의 후 피드백 시간, 어땠나요?",
        options: [
          { text: "자신의 발표를 분석하며 개선점을 찾는다", value: "study" },
          { text: "동료의 의견에 귀 기울이며 배운다", value: "basic" },
          { text: "창의적인 개선안을 과감히 제시한다", value: "wizard" },
          { text: "따뜻한 미소로 분위기를 부드럽게 만든다", value: "burger" },
        ],
      },
    ],
  },
  {
    questions: [
      {
        question: "9. 새로운 기술 세미나, 첫 인상은 어땠나요?",
        options: [
          { text: "최신 트렌드를 단숨에 캐치한다", value: "earphone" },
          { text: "핵심 개념을 꼼꼼하게 메모한다", value: "study" },
          { text: "실제 사례에 열광하며 질문을 던진다", value: "basic" },
          { text: "혁신 아이디어에 영감을 받아 잔뜩 메모한다", value: "wizard" },
        ],
      },
      {
        question: "10. 코드 리뷰 시간, 당신의 모습은?",
        options: [
          { text: "깊이 있는 분석으로 문제를 척척 발견한다", value: "study" },
          { text: "간결한 피드백으로 개선점을 찝는다", value: "basic" },
          { text: "문제의 핵심을 빠르게 파악해 바로 조치한다", value: "boxer" },
          { text: "동료와 함께 해결 방안을 논의한다", value: "scarf" },
        ],
      },
      {
        question: "11. 프로젝트 마감 직전, 최후의 준비는?",
        options: [
          { text: "세밀한 계획으로 모든 것을 꼼꼼히 점검한다", value: "study" },
          { text: "우선순위를 재정리해 급한 작업부터 처리한다", value: "hoodie" },
          { text: "스트레스를 날려버리며 긍정 에너지를 발산한다", value: "burger" },
          { text: "차분하게 최종 점검을 마무리한다", value: "basic" },
        ],
      },
      {
        question: "12. 프로젝트 성공 후, 기분은 어땠나요?",
        options: [
          { text: "자신의 노력을 자랑스럽게 느낀다", value: "grad" },
          { text: "팀원들과 성공의 기쁨을 만끽한다", value: "scarf" },
          { text: "새로운 도전을 향한 열정이 불타오른다", value: "wizard" },
          { text: "조용히 성취의 여운에 잠긴다", value: "earphone" },
        ],
      },
    ],
  },
];

//
// 2. 9가지 성향에 따른 결과 매핑
//
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

// 2-1. 성향별 잘 맞는 캐릭터 매핑 (임의 설정)
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

//
// 3. styled-components 정의
//
const Container = styled.div`
  max-width: 600px;
  margin: 50px auto;
  padding: 30px;
  background-color: #fdfdfd;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;
const Title = styled.h1`
  text-align: center;
  color: #333;
`;
const QuestionTitle = styled.h2`
  font-size: 1.25rem;
  margin-bottom: 20px;
  color: #333;
`;
const OptionButton = styled.button`
  width: 100%;
  padding: 12px;
  margin: 8px 0;
  border: none;
  border-radius: 4px;
  background-color: ${(props) => (props.selected ? "#4caf50" : "#3f51b5")};
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &:hover {
    background-color: ${(props) =>
      props.selected ? "#388e3c" : "#303f9f"};
  }
`;
const NextButton = styled.button`
  margin-top: 20px;
  padding: 12px 20px;
  background-color: #ff9800;
  border: none;
  border-radius: 4px;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  &:hover {
    background-color: #f57c00;
  }
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;
const RestartButton = styled.button`
  margin-top: 20px;
  padding: 12px 20px;
  background-color: #e91e63;
  border: none;
  border-radius: 4px;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  &:hover {
    background-color: #c2185b;
  }
`;
const StatsButton = styled.button`
  margin-top: 20px;
  padding: 12px 20px;
  background-color: #2196f3;
  border: none;
  border-radius: 4px;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  &:hover {
    background-color: #1976d2;
  }
`;
const Progress = styled.div`
  margin-top: 20px;
  font-size: 0.9rem;
  color: #666;
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

//
// 4. 통계 페이지: 로컬 스토리지 데이터를 불러와 Bar 차트로 시각화
//
const StatisticsPage = ({ onBack }) => {
  const [stats, setStats] = useState({});

  useEffect(() => {
    const data = localStorage.getItem("testResults");
    let results = data ? JSON.parse(data) : [];
    // 각 성향별 카운트 계산
    const counts = results.reduce((acc, curr) => {
      acc[curr] = (acc[curr] || 0) + 1;
      return acc;
    }, {});
    setStats(counts);
  }, []);

  // 차트 데이터 생성
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
        backgroundColor: "rgba(63, 81, 181, 0.5)",
        borderColor: "rgba(63, 81, 181, 1)",
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

//
// 5. 메인 컴포넌트: 다단계 테스트, 결과 및 통계 보기
//
export default function MultiPageTest() {
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState([]); // 각 답변: { page, qIndex, value }
  const [showResult, setShowResult] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [computedResult, setComputedResult] = useState(null);

  // 옵션 클릭 시 해당 답변 저장
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

  // 현재 페이지의 모든 질문에 답변했는지 확인
  const isPageAnswered = () => {
    const pageAnswers = answers.filter((ans) => ans.page === currentPage);
    return pageAnswers.length === questionPages[currentPage].questions.length;
  };

  // 전체 답변 중 최빈 결과(성향)를 계산  
  // (빈도수가 같은 경우 후보들 중 무작위 선택)
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

  // 로컬 스토리지에 테스트 결과 저장 (성향 타입만 저장)
  const storeTestResult = (resultType) => {
    const data = localStorage.getItem("testResults");
    let results = data ? JSON.parse(data) : [];
    results.push(resultType);
    localStorage.setItem("testResults", JSON.stringify(results));
  };

  // 페이지 이동 및 결과 처리
  const handleNextPage = () => {
    if (currentPage < questionPages.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      const computed = computeResult();
      storeTestResult(computed.type);
      // computedResult에 타입 정보도 함께 저장
      setComputedResult(computed);
      setShowResult(true);
    }
  };

  // 테스트 초기화
  const handleRestart = () => {
    setCurrentPage(0);
    setAnswers([]);
    setShowResult(false);
    setShowStats(false);
    setComputedResult(null);
  };

  // 결과 화면 렌더링: 결과와 통계 보기 버튼 포함
  if (showResult) {
    if (showStats) {
      return <StatisticsPage onBack={() => setShowStats(false)} />;
    }

    // computedResult.type를 바탕으로 잘 맞는 캐릭터 계산
    const matchingKeys = characterMatches[computedResult.type] || [];
    const matchingCharacters = matchingKeys.map(
      (key) => characterDescriptions[key]
    );

    return (
      <Container>
        <Title>결과</Title>
        <ResultImage src={computedResult.data.image} alt={computedResult.data.title} />
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
        <NextButton onClick={handleRestart}>테스트 다시하기</NextButton>
        <StatsButton onClick={() => setShowStats(true)}>
          통계 보기
        </StatsButton>
      </Container>
    );
  }

  // 현재 페이지의 질문 렌더링
  const currentQuestions = questionPages[currentPage].questions;
  return (
    <Container>
      <Title> MEET PICK 당신과 어울리는 미기는? </Title>
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
  );
}
