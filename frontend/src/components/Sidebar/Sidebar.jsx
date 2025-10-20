import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  BookOpen,
  Code,
  Database,
  Coffee,
  Cpu,
  Globe,
  Layout,
  ChevronRight,
  ChevronDown,
  CheckCircle,
  XCircle,
  Award,
  Terminal,
  Star,
  Trophy,
  Sparkles,
  Zap,
  Target,
  Menu,
  X,
  User, // New icon for login prompt
} from "lucide-react";

// Assuming these imports are correct and available
import questionsData from "../Sidebar/dummydata";
import { sidebarStyles } from "../../assets/dummyStyles";

const API_BASE = "http://localhost:5000";

const Sidebar = () => {
  const [selectedTech, setSelectedTech] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // New state for login status

  const submittedRef = useRef(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const asideRef = useRef(null);

  // --- AUTHENTICATION CHECK EFFECT ---
  useEffect(() => {
    // Check for a token on load (you might call this check from a parent/context)
    const token =
      localStorage.getItem("token") || localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
  }, []);
  // ------------------------------------

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsSidebarOpen(true);
      else setIsSidebarOpen(false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (window.innerWidth < 768) {
      if (isSidebarOpen) document.body.style.overflow = "hidden";
      else document.body.style.overflow = "";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen]);

  const technologies = [
    {
      id: "html",
      name: "HTML",
      icon: <Globe size={20} />,
      color: "bg-orange-50 text-orange-600 border-orange-200",
    },
    {
      id: "css",
      name: "CSS",
      icon: <Layout size={20} />,
      color: "bg-blue-50 text-blue-600 border-blue-200",
    },
    {
      id: "js",
      name: "JavaScript",
      icon: <Code size={20} />,
      color: "bg-yellow-50 text-yellow-600 border-yellow-200",
    },
    {
      id: "react",
      name: "React",
      icon: <Cpu size={20} />,
      color: "bg-cyan-50 text-cyan-600 border-cyan-200",
    },
    {
      id: "node",
      name: "Node.js",
      icon: <Code size={20} />,
      color: "bg-green-50 text-green-600 border-green-200",
    },
    {
      id: "mongodb",
      name: "MongoDB",
      icon: <Database size={20} />,
      color: "bg-emerald-50 text-emerald-600 border-emerald-200",
    },
    {
      id: "java",
      name: "Java",
      icon: <Coffee size={20} />,
      color: "bg-red-50 text-red-600 border-red-200",
    },
    {
      id: "python",
      name: "Python",
      icon: <Terminal size={20} />,
      color: "bg-indigo-50 text-indigo-600 border-indigo-200",
    },
    {
      id: "cpp",
      name: "C++",
      icon: <Code size={20} />,
      color: "bg-purple-50 text-purple-600 border-purple-200",
    },
    {
      id: "bootstrap",
      name: "Bootstrap",
      icon: <Layout size={20} />,
      color: "bg-pink-50 text-pink-600 border-pink-200",
    },
  ];

  const levels = [
    {
      id: "basic",
      name: "Basic",
      questions: 20,
      icon: <Star size={16} />,
      color: "bg-green-50 text-green-600",
    },
    {
      id: "intermediate",
      name: "Intermediate",
      questions: 40,
      icon: <Zap size={16} />,
      color: "bg-blue-50 text-blue-600",
    },
    {
      id: "advanced",
      name: "Advanced",
      questions: 60,
      icon: <Target size={16} />,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  const handleTechSelect = (techId) => {
    // --- AUTH CHECK: Do nothing if not logged in ---
    if (!isLoggedIn) {
      toast.error("Please log in to start a quiz.");
      return;
    }
    // --------------------------------------------------

    if (selectedTech === techId) {
      setSelectedTech(null);
      setSelectedLevel(null);
    } else {
      setSelectedTech(techId);
      setSelectedLevel(null);
    }
    setCurrentQuestion(0);
    setUserAnswers({});
    setShowResults(false);
    submittedRef.current = false;

    if (window.innerWidth < 768) setIsSidebarOpen(true);

    setTimeout(() => {
      const el = asideRef.current?.querySelector(`[data-tech="${techId}"]`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 120);
  };

  const handleLevelSelect = (levelId) => {
    // --- AUTH CHECK: Do nothing if not logged in ---
    if (!isLoggedIn) return;
    // --------------------------------------------------

    setSelectedLevel(levelId);
    setCurrentQuestion(0);
    setUserAnswers({});
    setShowResults(false);
    submittedRef.current = false;

    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const handleAnswerSelect = (answerIndex) => {
    // --- AUTH CHECK: Do nothing if not logged in ---
    if (!isLoggedIn) return;
    // --------------------------------------------------

    const newAnswers = { ...userAnswers, [currentQuestion]: answerIndex };
    setUserAnswers(newAnswers);
    setTimeout(() => {
      if (currentQuestion < getQuestions().length - 1) {
        setCurrentQuestion((prev) => prev + 1);
      } else {
        setShowResults(true);
      }
    }, 500);
  };

  // Rest of the helper functions remain the same
  const getQuestions = () => {
    if (!selectedTech || !selectedLevel) return [];
    return questionsData[selectedTech]?.[selectedLevel] || [];
  };

  const calculateScore = () => {
    const questions = getQuestions();
    let correct = 0;
    questions.forEach((question, index) => {
      if (userAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });
    return {
      correct,
      total: questions.length,
      percentage: questions.length
        ? Math.round((correct / questions.length) * 100)
        : 0,
    };
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setUserAnswers({});
    setShowResults(false);
    submittedRef.current = false;
  };

  const questions = getQuestions();
  const currentQ = questions[currentQuestion];
  const score = calculateScore();

  const getPerformanceStatus = () => {
    if (score.percentage >= 90)
      return {
        text: "Outstanding!",
        color: "bg-gradient-to-r from-amber-200 to-amber-300",
        icon: <Sparkles className="text-amber-800" />,
      };
    if (score.percentage >= 75)
      return {
        text: "Excellent!",
        color: "bg-gradient-to-r from-blue-200 to-indigo-200",
        icon: <Trophy className="text-blue-800" />,
      };
    if (score.percentage >= 60)
      return {
        text: "Good Job!",
        color: "bg-gradient-to-r from-green-200 to-teal-200",
        icon: <Award className="text-green-800" />,
      };
    return {
      text: "Keep Practicing",
      color: "bg-gradient-to-r from-gray-200 to-gray-300",
      icon: <BookOpen className="text-gray-800" />,
    };
  };

  const performance = getPerformanceStatus();

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const getAuthHeader = () => {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const submitResult = async () => {
    if (submittedRef.current) return;
    if (!selectedTech || !selectedLevel) return;

    // --- AUTH CHECK: Do not submit if not logged in ---
    if (!isLoggedIn) {
      toast.warn("Cannot save result. User is not logged in.");
      return;
    }
    // ----------------------------------------------------

    const payload = {
      title: `${selectedTech.toUpperCase()} - ${
        selectedLevel.charAt(0).toUpperCase() + selectedLevel.slice(1)
      } quiz`,
      technology: selectedTech,
      level: selectedLevel,
      totalQuestions: score.total,
      correct: score.correct,
      wrong: score.total - score.correct,
    };

    try {
      submittedRef.current = true;
      toast.info("Saving your result...");
      const res = await axios.post(`${API_BASE}/api/results`, payload, {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        timeout: 10000,
      });

      if (res.data && res.data.success) {
        toast.success("Result saved!");
      } else {
        toast.warn("Result not saved. Server responded unexpectedly.");
        submittedRef.current = false;
      }
    } catch (err) {
      submittedRef.current = false;
      console.error(
        "Error saving result:",
        err?.response?.data || err.message || err
      );
      // More explicit error message for unauthenticated users
      if (err.response && err.response.status === 401) {
        toast.error("You must be logged in to save results.");
      } else {
        toast.error("Could not save result. Check console or network.");
      }
    }
  };

  useEffect(() => {
    if (showResults) {
      submitResult();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showResults]);

  // --- NEW COMPONENT: Login Required Prompt ---
  const LoginRequiredPrompt = () => (
    <div className={sidebarStyles.welcomeContainer}>
      <div className={sidebarStyles.welcomeContent}>
        <div className={sidebarStyles.welcomeIcon}>
          <User size={90} className="text-blue-600" />
        </div>
        <h2 className={sidebarStyles.welcomeTitle}>
          Authentication Required
        </h2>
        <p className={sidebarStyles.welcomeDescription}>
          Unlock your potential! Log in or sign up to start the quiz and track your mastery.
        </p>
        <div className={sidebarStyles.welcomePrompt}>
          <p className={`${sidebarStyles.welcomePromptText} `}>
            <h2>Unlock your quiz journey! Please log in or sign up to begin.</h2>
          </p>
        </div>
      </div>
    </div>
  );
  // --------------------------------------------

  // --- RENDER LOGIC MODIFIED FOR LOGIN CHECK ---
  let mainContent;

  if (!isLoggedIn) {
    mainContent = <LoginRequiredPrompt />;
  } else if (!selectedTech) {
    mainContent = (
      <div className={sidebarStyles.welcomeContainer}>
        <div className={sidebarStyles.welcomeContent}>
          <div className={sidebarStyles.welcomeIcon}>
            <Award size={64} className="text-indigo-700" />
          </div>
          <h2 className={sidebarStyles.welcomeTitle}>
            Welcome to Tech Quiz Master
          </h2>
          <p className={sidebarStyles.welcomeDescription}>
            Select a technology from the sidebar to start your quiz
            journey. Test your knowledge at basic, intermediate, or
            advanced levels.
          </p>
          {/* ... Rest of the feature grid content ... */}
          <div className={sidebarStyles.featuresGrid}>
            <div className={sidebarStyles.featureCard}>
              <div className={sidebarStyles.featureIcon}>
                <Star size={20} />
              </div>
              <h3 className={sidebarStyles.featureTitle}>
                Multiple Technologies
              </h3>
              <p className={sidebarStyles.featureDescription}>
                HTML, CSS, JavaScript, React, and more
              </p>
            </div>

            <div className={sidebarStyles.featureCard}>
              <div className={sidebarStyles.featureIcon}>
                <Zap size={20} />
              </div>
              <h3 className={sidebarStyles.featureTitle}>
                Three Difficulty Levels
              </h3>
              <p className={sidebarStyles.featureDescription}>
                Basic, Intermediate, and Advanced challenges
              </p>
            </div>

            <div className={sidebarStyles.featureCard}>
              <div className={sidebarStyles.featureIcon}>
                <Target size={20} />
              </div>
              <h3 className={sidebarStyles.featureTitle}>
                Instant Feedback
              </h3>
              <p className={sidebarStyles.featureDescription}>
                Get detailed results and performance analysis
              </p>
            </div>
          </div>
          <div className={sidebarStyles.welcomePrompt}>
            <p className={sidebarStyles.welcomePromptText}>
              <Sparkles size={16} className="mr-2" />
              Select any technology to begin your learning adventure!
            </p>
          </div>
        </div>
      </div>
    );
  } else if (!selectedLevel) {
    mainContent = (
      <div className={sidebarStyles.levelSelectionContainer}>
        <div className={sidebarStyles.levelSelectionContent}>
          <div
            className={`${sidebarStyles.techSelectionIcon} ${
              technologies.find((t) => t.id === selectedTech).color
            }`}
          >
            {technologies.find((t) => t.id === selectedTech).icon}
          </div>
          <h2 className={sidebarStyles.techSelectionTitle}>
            {technologies.find((t) => t.id === selectedTech).name} Quiz
          </h2>
          <p className={sidebarStyles.techSelectionDescription}>
            Select a difficulty level to begin your challenge
          </p>
          <div className={sidebarStyles.techSelectionPrompt}>
            <p className={sidebarStyles.techSelectionPromptText}>
              Get ready to test your{" "}
              {technologies.find((t) => t.id === selectedTech).name}{" "}
              knowledge!
            </p>
          </div>
        </div>
      </div>
    );
  } else if (showResults) {
    mainContent = (
      <div className={sidebarStyles.resultsContainer}>
        <div className={sidebarStyles.resultsContent}>
          <div className={sidebarStyles.resultsHeader}>
            <div
              className={`${sidebarStyles.performanceIcon} ${performance.color}`}
            >
              {performance.icon}
            </div>
            <h2 className={sidebarStyles.resultsTitle}>Quiz Completed!</h2>
            <p className={sidebarStyles.resultsSubtitle}>
              You've completed the {selectedLevel} level
            </p>
            <div
              className={`${sidebarStyles.performanceBadge} ${performance.color}`}
            >
              {performance.text}
            </div>
            <div className={sidebarStyles.scoreGrid}>
              <div className={sidebarStyles.scoreCard}>
                <div className={sidebarStyles.scoreIcon}>
                  <CheckCircle size={24} />
                </div>
                <p className={sidebarStyles.scoreNumber}>{score.correct}</p>
                <p className={sidebarStyles.scoreLabel}>Correct Answers</p>
              </div>
              <div className={sidebarStyles.scoreCard}>
                <div className={sidebarStyles.scoreIcon}>
                  <XCircle size={24} />
                </div>
                <p className={sidebarStyles.scoreNumber}>
                  {score.total - score.correct}
                </p>
                <p className={sidebarStyles.scoreLabel}>Incorrect Answers</p>
              </div>
            </div>
            <div className={sidebarStyles.scoreProgress}>
              <div className={sidebarStyles.scoreProgressHeader}>
                <span className={sidebarStyles.scoreProgressTitle}>
                  Overall Score
                </span>
                <span className={sidebarStyles.scoreProgressPercentage}>
                  {score.percentage}%
                </span>
              </div>
              <div className={sidebarStyles.scoreProgressBar}>
                <div
                  className={`${sidebarStyles.scoreProgressFill} ${
                    score.percentage >= 80
                      ? "bg-green-400"
                      : score.percentage >= 60
                      ? "bg-yellow-400"
                      : "bg-red-400"
                  }`}
                  style={{ width: `${score.percentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (currentQ) {
    mainContent = (
      <div className={sidebarStyles.quizContainer}>
        <div className={sidebarStyles.quizHeader}>
          <div className={sidebarStyles.quizTitleContainer}>
            <h1 className={sidebarStyles.quizTitle}>
              {technologies.find((t) => t.id === selectedTech).name} -{" "}
              {selectedLevel.charAt(0).toUpperCase() + selectedLevel.slice(1)}{" "}
              Level
            </h1>
            <span className={sidebarStyles.quizCounter}>
              Question {currentQuestion + 1} of {questions.length}
            </span>
          </div>
          <div className={sidebarStyles.progressBar}>
            <div
              className={sidebarStyles.progressFill}
              style={{
                width: `${
                  ((currentQuestion + 1) / (questions.length || 1)) * 100
                }%`,
              }}
            />
          </div>
        </div>
        <div className={sidebarStyles.questionContainer}>
          <div className={sidebarStyles.questionHeader}>
            <div className={sidebarStyles.questionIcon}>
              <Target size={20} />
            </div>
            <h2 className={sidebarStyles.questionText}>
              {currentQ.question}
            </h2>
          </div>
          <div className={sidebarStyles.optionsContainer}>
            {currentQ.options.map((option, index) => {
              const isSelected = userAnswers[currentQuestion] === index;
              const isCorrect = index === currentQ.correctAnswer;
              const showFeedback = userAnswers[currentQuestion] !== undefined;
              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={userAnswers[currentQuestion] !== undefined}
                  className={`${sidebarStyles.optionButton} ${
                    isSelected
                      ? isCorrect
                        ? sidebarStyles.optionCorrect
                        : sidebarStyles.optionIncorrect
                      : showFeedback && isCorrect
                      ? sidebarStyles.optionCorrect
                      : sidebarStyles.optionNormal
                  }`}
                >
                  <div className={sidebarStyles.optionContent}>
                    {showFeedback ? (
                      isSelected ? (
                        isCorrect ? (
                          <CheckCircle
                            size={20}
                            className={sidebarStyles.optionIconCorrect}
                          />
                        ) : (
                          <XCircle
                            size={20}
                            className={sidebarStyles.optionIconIncorrect}
                          />
                        )
                      ) : isCorrect ? (
                        <CheckCircle
                          size={20}
                          className={sidebarStyles.optionIconCorrect}
                        />
                      ) : (
                        <div className={sidebarStyles.optionIconEmpty} />
                      )
                    ) : (
                      <div className={sidebarStyles.optionIconEmpty} />
                    )}
                    <span className={sidebarStyles.optionText}>{option}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  } else {
    mainContent = (
      <div className={sidebarStyles.loadingContainer}>
        <div className={sidebarStyles.loadingContent}>
          <div className={sidebarStyles.loadingSpinner} />
          <h3 className={sidebarStyles.loadingTitle}>Preparing Your Quiz</h3>
          <p className={sidebarStyles.loadingDescription}>
            Loading questions...
          </p>
        </div>
      </div>
    );
  }
  // ----------------------------------------------------

  return (
    <div className={sidebarStyles.pageContainer}>
      {/* Mobile overlay when sidebar is open */}
      {isSidebarOpen && (
        <div
          onClick={() => window.innerWidth < 768 && setIsSidebarOpen(false)}
          className={sidebarStyles.mobileOverlay}
          aria-hidden
        />
      )}

      <div className={sidebarStyles.mainContainer}>
        {/* Sidebar (ASIDE element) */}
        <aside
          ref={asideRef}
          className={`${sidebarStyles.sidebar} ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          aria-hidden={!isSidebarOpen && window.innerWidth < 768}
        >
          {/* ... Sidebar Header and Footer remain the same ... */}
          <div className={sidebarStyles.sidebarHeader}>
            <div className={sidebarStyles.headerDecoration1} />
            <div className={sidebarStyles.headerDecoration2} />
            <div className={sidebarStyles.headerContent}>
              <div className={sidebarStyles.logoContainer}>
                <div className={sidebarStyles.logoIcon}>
                  <BookOpen size={28} className="text-indigo-700" />
                </div>
                <div>
                  <h1 className={sidebarStyles.logoTitle}>Tech Quiz Master</h1>
                  <p className={sidebarStyles.logoSubtitle}>
                    Test your knowledge & improve skills
                  </p>
                </div>
              </div>
              <button
                onClick={toggleSidebar}
                className={sidebarStyles.closeButton}
                aria-label="Close sidebar"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className={sidebarStyles.sidebarContent}>
            <div className={sidebarStyles.technologiesHeader}>
              <h2 className={sidebarStyles.technologiesTitle}>Technologies</h2>
              <span className={sidebarStyles.technologiesCount}>
                {technologies.length} options
              </span>
            </div>
            {/* Tech List */}
            {technologies.map((tech) => (
              <div
                key={tech.id}
                className={sidebarStyles.techItem}
                data-tech={tech.id}
              >
                <button
                  onClick={() => handleTechSelect(tech.id)}
                  // NOTE: Added 'disabled' state for the button
                  disabled={!isLoggedIn} 
                  className={`${sidebarStyles.techButton} ${
                    selectedTech === tech.id
                      ? `${tech.color} ${sidebarStyles.techButtonSelected}`
                      : sidebarStyles.techButtonNormal
                  } ${!isLoggedIn ? 'opacity-50 cursor-not-allowed' : ''} `}
                >
                  <div className={sidebarStyles.techButtonContent}>
                    <span className={`${sidebarStyles.techIcon} ${tech.color}`}>
                      {tech.icon}
                    </span>
                    <span className={sidebarStyles.techName}>{tech.name}</span>
                  </div>
                  {selectedTech === tech.id ? (
                    <ChevronDown size={18} className="text-current" />
                  ) : (
                    <ChevronRight size={18} className="text-gray-400" />
                  )}
                </button>

                {selectedTech === tech.id && (
                  <div className={sidebarStyles.levelsContainer}>
                    <h3 className={sidebarStyles.levelsTitle}>
                      <span>Select Difficulty</span>
                      <span className={sidebarStyles.techBadge}>
                        {technologies.find((t) => t.id === selectedTech).name}
                      </span>
                    </h3>

                    {levels.map((level) => (
                      <button
                        key={level.id}
                        onClick={() => handleLevelSelect(level.id)}
                        disabled={!isLoggedIn} // NOTE: Added 'disabled' state for level buttons
                        className={`${sidebarStyles.levelButton} ${
                          selectedLevel === level.id
                            ? `${level.color} ${sidebarStyles.levelButtonSelected}`
                            : sidebarStyles.levelButtonNormal
                        } ${!isLoggedIn ? 'opacity-50 cursor-not-allowed' : ''} `}
                      >
                        <div className={sidebarStyles.levelButtonContent}>
                          <span
                            className={`${sidebarStyles.levelIcon} ${
                              selectedLevel === level.id
                                ? "bg-white/40"
                                : "bg-gray-100"
                            }`}
                          >
                            {level.icon}
                          </span>
                          <span>{level.name}</span>
                        </div>
                        <span className={sidebarStyles.levelQuestions}>
                          {level.questions} Qs
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className={sidebarStyles.sidebarFooter}>
            <div className={sidebarStyles.footerContent}>
              <div className={sidebarStyles.footerContentCenter}>
                <p>Master your skills one quiz at a time</p>
                <p className={sidebarStyles.footerHighlight}>
                  Keep Learning, Keep Growing!
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className={sidebarStyles.mainContent}>
          {/* ... Mobile Header remains the same ... */}
          <div className={sidebarStyles.mobileHeader}>
            <button
              onClick={toggleSidebar}
              className={sidebarStyles.menuButton}
            >
              <Menu size={20} />
            </button>
            <div className={sidebarStyles.mobileTitle}>
              {selectedTech && isLoggedIn ? (
                <div className={sidebarStyles.mobileTechInfo}>
                  <div
                    className={`${sidebarStyles.mobileTechIcon} ${
                      technologies.find((t) => t.id === selectedTech).color
                    }`}
                  >
                    {technologies.find((t) => t.id === selectedTech).icon}
                  </div>
                  <div className={sidebarStyles.mobileTechText}>
                    <div className={sidebarStyles.mobileTechName}>
                      {technologies.find((t) => t.id === selectedTech).name}
                    </div>
                    <div className={sidebarStyles.mobileTechLevel}>
                      {selectedLevel
                        ? `${
                            selectedLevel.charAt(0).toUpperCase() +
                            selectedLevel.slice(1)
                          } level`
                        : "Select level"}
                    </div>
                  </div>
                </div>
              ) : (
                <div className={sidebarStyles.mobilePlaceholder}>
                  {isLoggedIn ? 'Select a technology from the menu' : 'Login Required'}
                </div>
              )}
            </div>
          </div>
          
          {/* Mobile Levels section (Only appears if logged in) */}
          {isLoggedIn && selectedTech && !selectedLevel && (
            <div className={sidebarStyles.mobileLevels}>
              <div className={sidebarStyles.mobileLevelsContainer}>
                {levels.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => handleLevelSelect(l.id)}
                    className={sidebarStyles.mobileLevelButton}
                  >
                    {l.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Render the calculated main content */}
          {mainContent}
        </main>
      </div>

      <style>{sidebarStyles.customStyles}</style>
    </div>
  );
};

export default Sidebar;