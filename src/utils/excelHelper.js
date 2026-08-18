import * as XLSX from "xlsx";

/**
 * Normalizes a key by converting to lower case, removing all punctuation, symbols, spaces, and Arabic diacritics.
 */
function normalizeKey(key) {
  if (!key) return "";
  return String(key)
    .trim()
    .toLowerCase()
    .replace(/[ً-ْ]/g, "") // remove arabic diacritics / tashkeel
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/[\s_\-./\\:()[\]{}'"`~,،;!?*#+=|<>–—]+/g, ""); // remove all symbols & punctuation
}

/**
 * Finds a field value from an object using a list of possible alias names with intelligent fuzzy matching.
 */
function getField(row, aliases) {
  if (!row || typeof row !== "object") return null;
  const rowKeys = Object.keys(row);

  // 1. Build map of clean normalized key -> value
  const normalizedMap = {};
  for (const k of rowKeys) {
    const val = row[k];
    if (val !== undefined && val !== null && String(val).trim() !== "") {
      normalizedMap[normalizeKey(k)] = val;
    }
  }

  // 2. Exact match on normalized alias
  for (const alias of aliases) {
    const normAlias = normalizeKey(alias);
    if (normalizedMap[normAlias] !== undefined) {
      return normalizedMap[normAlias];
    }
  }

  // 3. Substring / inclusion match on normalized keys
  for (const alias of aliases) {
    const normAlias = normalizeKey(alias);
    if (!normAlias || normAlias.length < 2) continue;
    for (const [normKey, val] of Object.entries(normalizedMap)) {
      if (normKey.includes(normAlias) || normAlias.includes(normKey)) {
        return val;
      }
    }
  }

  return null;
}

/**
 * Parses an uploaded Excel or CSV file (.xlsx, .xls, .csv) into Quizify category/question structure.
 * @param {File} file
 * @returns {Promise<{ categories: Array, totalQuestions: number, summary: Object }>}
 */
export function parseExcelFile(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(
        new Error("No file provided. Please upload an Excel (.xlsx, .xls) or CSV file.")
      );
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array", cellDates: true });

        if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
          throw new Error("The uploaded file does not contain any sheets.");
        }

        const allQuestions = [];
        const sheetSummaries = [];

        workbook.SheetNames.forEach((sheetName) => {
          const worksheet = workbook.Sheets[sheetName];
          const rows = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

          if (!rows || rows.length === 0) return;

          let sheetQCount = 0;

          rows.forEach((row) => {
            // 1. Extract Question
            const questionText = getField(row, [
              "question",
              "questiontext",
              "السؤال",
              "نصالسؤال",
              "نصالسوال",
              "السوال",
              "نص",
              "prompt",
              "q",
              "title",
            ]);

            if (!questionText || !String(questionText).trim()) {
              return; // Skip empty rows
            }

            // 2. Extract Category
            const categoryName =
              getField(row, [
                "category",
                "categoryname",
                "الفئة",
                "الفئه",
                "الموضوع",
                "القسم",
                "section",
                "topic",
                "cat",
              ]) ||
              sheetName ||
              "General";

            // 3. Extract Points
            const rawPoints = getField(row, [
              "points",
              "point",
              "score",
              "النقاط",
              "الدرجات",
              "درجة",
              "درجه",
              "علامات",
            ]);
            const points = parseInt(rawPoints, 10) > 0 ? parseInt(rawPoints, 10) : 10;

            // 4. Extract Options (for MCQ)
            const opt1 = getField(row, [
              "option1",
              "optiona",
              "opta",
              "opt1",
              "الخيار1",
              "الخيارأ",
              "الخيارا",
              "أ",
              "a",
              "choice1",
              "1",
            ]);
            const opt2 = getField(row, [
              "option2",
              "optionb",
              "optb",
              "opt2",
              "الخيار2",
              "الخيارب",
              "ب",
              "b",
              "choice2",
              "2",
            ]);
            const opt3 = getField(row, [
              "option3",
              "optionc",
              "optc",
              "opt3",
              "الخيار3",
              "الخيارج",
              "ج",
              "c",
              "choice3",
              "3",
            ]);
            const opt4 = getField(row, [
              "option4",
              "optiond",
              "optd",
              "opt4",
              "الخيار4",
              "الخيارد",
              "د",
              "d",
              "choice4",
              "4",
            ]);
            const opt5 = getField(row, [
              "option5",
              "optione",
              "opte",
              "opt5",
              "الخيار5",
              "الخيارهـ",
              "هـ",
              "e",
              "choice5",
            ]);
            const opt6 = getField(row, [
              "option6",
              "optionf",
              "optf",
              "opt6",
              "الخيار6",
              "الخيارو",
              "و",
              "f",
              "choice6",
            ]);

            let options = [opt1, opt2, opt3, opt4, opt5, opt6]
              .filter((opt) => opt !== null && opt !== undefined && String(opt).trim() !== "")
              .map((opt) => String(opt).trim());

            // Fallback: If options were provided in a single delimited column
            if (options.length < 2) {
              const rawOptionsCol = getField(row, ["options", "choices", "الخيارات", "البدائل"]);
              if (rawOptionsCol) {
                const splitOpts = String(rawOptionsCol)
                  .split(/[|\n,،;]/)
                  .map((s) => s.trim())
                  .filter(Boolean);
                if (splitOpts.length >= 2) {
                  options = splitOpts;
                }
              }
            }

            // 5. Extract Type ('mcq' vs 'complete')
            const rawType = String(
              getField(row, [
                "type",
                "questiontype",
                "النوع",
                "نوعالسؤال",
                "نوعالسوال",
                "format",
                "محفوظات",
              ]) || ""
            ).toLowerCase();

            const isExplicitComplete =
              rawType.includes("complete") ||
              rawType.includes("blank") ||
              rawType.includes("fill") ||
              rawType.includes("محفوظات") ||
              rawType.includes("اكمل") ||
              rawType.includes("أكمل");

            // If question has no options or is marked as complete, treat as 'complete' (Fill in Blanks / Memorization)
            const questionType = isExplicitComplete || options.length < 2 ? "complete" : "mcq";

            // 6. Extract Correct Answer
            const rawCorrect = getField(row, [
              "correctanswer",
              "correct",
              "correctoption",
              "answer",
              "answers",
              "الإجابةالصحيحة",
              "الاجابةالصحيحة",
              "الإجابة",
              "الاجابة",
              "الحل",
              "الصحيح",
            ]);

            if (questionType === "complete") {
              allQuestions.push({
                category: String(categoryName).trim(),
                question: String(questionText).trim(),
                answer: rawCorrect ? String(rawCorrect).trim() : "",
                points,
                correctOption: 0,
              });
              sheetQCount++;
            } else {
              // MCQ question resolution
              let correctIndex = 0;
              const correctStr = String(rawCorrect ?? "").trim();
              const correctNum = parseInt(correctStr, 10);

              if (!isNaN(correctNum) && correctNum >= 1 && correctNum <= options.length) {
                correctIndex = correctNum - 1;
              } else if (!isNaN(correctNum) && correctNum === 0 && options.length > 0) {
                correctIndex = 0;
              } else {
                const letterMap = {
                  a: 0,
                  b: 1,
                  c: 2,
                  d: 3,
                  e: 4,
                  f: 5,
                  "أ": 0,
                  "ا": 0,
                  "ب": 1,
                  "ج": 2,
                  "د": 3,
                  "ه": 4,
                  "و": 5,
                  "1": 0,
                  "2": 1,
                  "3": 2,
                  "4": 3,
                };
                const normL = correctStr.toLowerCase();
                if (letterMap[normL] !== undefined && letterMap[normL] < options.length) {
                  correctIndex = letterMap[normL];
                } else {
                  const matchedIdx = options.findIndex(
                    (opt) => opt.toLowerCase() === correctStr.toLowerCase()
                  );
                  if (matchedIdx !== -1) {
                    correctIndex = matchedIdx;
                  }
                }
              }

              allQuestions.push({
                category: String(categoryName).trim(),
                question: String(questionText).trim(),
                options,
                correctOption: Math.max(0, Math.min(correctIndex, options.length - 1)),
                points,
              });
              sheetQCount++;
            }
          });

          if (sheetQCount > 0) {
            sheetSummaries.push({ sheetName, questionsCount: sheetQCount });
          }
        });

        if (allQuestions.length === 0) {
          throw new Error(
            "Could not find any valid questions in the uploaded file. Please ensure your file includes 'Question' and 'Options' (or 'Answer') columns. You can download our template for reference."
          );
        }

        // Group into categories
        const categoriesMap = {};
        allQuestions.forEach((q) => {
          const cat = q.category || "General";
          if (!categoriesMap[cat]) {
            // Category question type (mcq vs complete)
            categoriesMap[cat] = {
              title: cat,
              type: q.options && q.options.length >= 2 ? "mcq" : "complete",
              randomize: true,
              questions: [],
            };
          }
          const { category, ...cleanQ } = q;
          categoriesMap[cat].questions.push(cleanQ);
        });

        // Group questions with same points together (sorted ascending by points)
        Object.values(categoriesMap).forEach((catObj) => {
          catObj.questions.sort(
            (a, b) => (Number(a.points) || 10) - (Number(b.points) || 10)
          );
        });

        const categories = Object.values(categoriesMap);

        resolve({
          categories,
          totalQuestions: allQuestions.length,
          totalCategories: categories.length,
          sheetSummaries,
        });
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = () => {
      reject(new Error("Failed to read the file. Please check file permissions and try again."));
    };

    reader.readAsArrayBuffer(file);
  });
}

/**
 * Shuffles an array immutably.
 */
function shuffleArray(array) {
  const a = array.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Balances questions by grouping questions with the same points value,
 * and ensuring questions within each points tier are divided equally among all teams.
 *
 * Example:
 * If there are 6 questions with 5 points:
 * - With 6 teams: each team gets 1 question (total 6 questions).
 * - With 2 teams: each team gets 3 questions (total 6 questions).
 * - With 3 teams: each team gets 2 questions (total 6 questions).
 * - With 4 teams: each team gets 1 question (total 4 questions, 1 per team).
 *
 * If there are multiple points tiers (e.g. 5 pts, 10 pts, 15 pts):
 * - Each tier is balanced independently so all teams get the exact same number of questions
 *   for each point value, maintaining 100% fair competition.
 */
export function balanceQuestionsByPoints(questions = [], numTeams = 1, shouldShuffle = true) {
  if (!Array.isArray(questions) || questions.length === 0) return [];
  if (!numTeams || numTeams <= 1) {
    return shouldShuffle ? shuffleArray(questions) : [...questions];
  }

  // 1. Group questions by points value
  const buckets = {};
  questions.forEach((q) => {
    const pts = typeof q.points === "number" ? q.points : 10;
    if (!buckets[pts]) buckets[pts] = [];
    buckets[pts].push(q);
  });

  // 2. Sort point tiers in ascending order (e.g., 5 pts -> 10 pts -> 15 pts -> 20 pts)
  const sortedTiers = Object.keys(buckets)
    .map(Number)
    .sort((a, b) => a - b);

  const balancedList = [];

  sortedTiers.forEach((tier) => {
    let tierQuestions = shouldShuffle ? shuffleArray(buckets[tier]) : [...buckets[tier]];
    const totalInTier = tierQuestions.length;
    // Calculate equal share per team
    const questionsPerTeam = Math.floor(totalInTier / numTeams);
    const usableCount = questionsPerTeam * numTeams;

    if (usableCount > 0) {
      balancedList.push(...tierQuestions.slice(0, usableCount));
    }
  });

  // If no tier had enough questions for all teams, fallback to all available questions
  if (balancedList.length === 0) {
    return shouldShuffle ? shuffleArray(questions) : [...questions];
  }

  return balancedList;
}

/**
 * Generates and downloads a beautifully formatted Excel (.xlsx) template for Quizify questions.
 */
export function downloadExcelTemplate() {
  const sampleData = [
    {
      Category: "العقيدة والطقس (Theology)",
      Type: "mcq",
      Question: "كم عدد المجامع المسكونية المعترف بها في الكنيسة القبطية؟",
      "Option 1": "1",
      "Option 2": "2",
      "Option 3": "3",
      "Option 4": "4",
      "Correct Answer": "3",
      Points: 10,
    },
    {
      Category: "العقيدة والطقس (Theology)",
      Type: "mcq",
      Question: "مَن قائل عبارة: «لولا أثناسيوس لصار العالم كله أريوسيًّا»؟",
      "Option 1": "القديس جيروم",
      "Option 2": "القديس غريغوريوس النزينزي",
      "Option 3": "الأنبا قزمان",
      "Option 4": "الأنبا أنطونيوس",
      "Correct Answer": "1",
      Points: 10,
    },
    {
      Category: "محفوظات (Verses)",
      Type: "complete",
      Question: "هناك صعدت القبائل، قبائل الرب شهادة ــــــــــــ",
      "Option 1": "",
      "Option 2": "",
      "Option 3": "",
      "Option 4": "",
      "Correct Answer": "لإسرائيل",
      Points: 10,
    },
    {
      Category: "General Knowledge",
      Type: "mcq",
      Question: "Which planet in our solar system is known as the Red Planet?",
      "Option 1": "Venus",
      "Option 2": "Mars",
      "Option 3": "Jupiter",
      "Option 4": "Saturn",
      "Correct Answer": "2",
      Points: 10,
    },
    {
      Category: "Science & Tech",
      Type: "mcq",
      Question: "What is the chemical symbol for Gold?",
      "Option 1": "Ag",
      "Option 2": "Fe",
      "Option 3": "Au",
      "Option 4": "Pb",
      "Correct Answer": "Au",
      Points: 15,
    },
    {
      Category: "Bible Trivia",
      Type: "complete",
      Question: "In the beginning God created the ___ and the ___",
      "Option 1": "",
      "Option 2": "",
      "Option 3": "",
      "Option 4": "",
      "Correct Answer": "heavens, earth",
      Points: 10,
    },
  ];

  // 1. Create workbook and worksheet
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(sampleData);

  // 2. Set nice column widths for Excel
  worksheet["!cols"] = [
    { wch: 26 }, // Category
    { wch: 14 }, // Type
    { wch: 45 }, // Question
    { wch: 22 }, // Option 1
    { wch: 22 }, // Option 2
    { wch: 22 }, // Option 3
    { wch: 22 }, // Option 4
    { wch: 28 }, // Correct Answer
    { wch: 12 }, // Points
  ];

  // 3. Append sheet and download
  XLSX.utils.book_append_sheet(workbook, worksheet, "Quiz Questions");
  XLSX.writeFile(workbook, "Quizify_Questions_Template.xlsx");
}
