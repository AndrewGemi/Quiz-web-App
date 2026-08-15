import * as XLSX from "xlsx";

/**
 * Normalizes a key by converting to lower case, removing spaces, underscores, dashes, and Arabic diacritics.
 */
function normalizeKey(key) {
  if (!key) return "";
  return String(key)
    .trim()
    .toLowerCase()
    .replace(/[\s_\-\.\/\\:]+/g, "")
    .replace(/[ً-ْ]/g, "") // remove arabic diacritics
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي");
}

/**
 * Finds a field value from an object using a list of possible alias names.
 */
function getField(row, aliases) {
  const rowKeys = Object.keys(row);
  const normalizedMap = {};
  for (const k of rowKeys) {
    normalizedMap[normalizeKey(k)] = row[k];
  }

  for (const alias of aliases) {
    const normAlias = normalizeKey(alias);
    if (normalizedMap[normAlias] !== undefined && normalizedMap[normAlias] !== "") {
      return normalizedMap[normAlias];
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
      return reject(new Error("No file provided. Please upload an Excel (.xlsx, .xls) or CSV file."));
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
              "question", "questiontext", "السؤال", "نصالسؤال", "نص", "prompt", "q", "title", "نصالسوال"
            ]);

            if (!questionText || !String(questionText).trim()) {
              return; // Skip empty rows
            }

            // 2. Extract Category
            const categoryName =
              getField(row, [
                "category", "categoryname", "الفئة", "الفئه", "الموضوع", "القسم", "section", "topic", "cat"
              ]) ||
              sheetName ||
              "General";

            // 3. Extract Type ('mcq' vs 'complete')
            const rawType = String(
              getField(row, ["type", "questiontype", "النوع", "نوعالسؤال", "نوعالسوال", "format"]) || ""
            ).toLowerCase();

            const isCompleteType =
              rawType.includes("complete") ||
              rawType.includes("blank") ||
              rawType.includes("fill") ||
              rawType.includes("محفوظات") ||
              rawType.includes("اكمل") ||
              rawType.includes("أكمل");

            const questionType = isCompleteType ? "complete" : "mcq";

            // 4. Extract Points
            const rawPoints = getField(row, ["points", "point", "score", "النقاط", "الدرجات", "درجة", "درجه", "علامات"]);
            const points = parseInt(rawPoints, 10) > 0 ? parseInt(rawPoints, 10) : 10;

            // 5. Extract Options (for MCQ) or Answers (for Complete)
            if (questionType === "complete") {
              const rawAnswer = getField(row, [
                "correctanswer", "correct", "answer", "answers", "الإجابةالصحيحة", "الاجابةالصحيحة", "الاجابة", "الحل", "الإجابة"
              ]);

              allQuestions.push({
                category: String(categoryName).trim(),
                question: String(questionText).trim(),
                answer: rawAnswer ? String(rawAnswer).trim() : "",
                points,
                correctOption: 0,
              });
              sheetQCount++;
            } else {
              // MCQ question: extract options
              const opt1 = getField(row, ["option1", "optiona", "opta", "opt1", "الخيار1", "الخيارأ", "أ", "a", "choice1", "1"]);
              const opt2 = getField(row, ["option2", "optionb", "optb", "opt2", "الخيار2", "الخيارب", "ب", "b", "choice2", "2"]);
              const opt3 = getField(row, ["option3", "optionc", "optc", "opt3", "الخيار3", "الخيارج", "ج", "c", "choice3", "3"]);
              const opt4 = getField(row, ["option4", "optiond", "optd", "opt4", "الخيار4", "الخيارد", "د", "d", "choice4", "4"]);
              const opt5 = getField(row, ["option5", "optione", "opte", "opt5", "الخيار5", "الخيارهـ", "هـ", "e", "choice5"]);
              const opt6 = getField(row, ["option6", "optionf", "optf", "opt6", "الخيار6", "الخيارو", "و", "f", "choice6"]);

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

              if (options.length < 2) {
                // If not enough options, skip invalid MCQ
                return;
              }

              // 6. Resolve Correct Option index
              const rawCorrect = getField(row, [
                "correctanswer", "correct", "correctoption", "answer", "الإجابةالصحيحة", "الاجابةالصحيحة", "الإجابة", "الاجابة", "الحل", "الصحيح"
              ]);

              let correctIndex = 0;
              const correctStr = String(rawCorrect ?? "").trim();
              const correctNum = parseInt(correctStr, 10);

              if (!isNaN(correctNum) && correctNum >= 1 && correctNum <= options.length) {
                // 1-based index (e.g. 1, 2, 3, 4)
                correctIndex = correctNum - 1;
              } else if (!isNaN(correctNum) && correctNum === 0 && options.length > 0) {
                // 0-based index
                correctIndex = 0;
              } else {
                // Letter or Text match
                const letterMap = {
                  a: 0, b: 1, c: 2, d: 3, e: 4, f: 5,
                  "أ": 0, "ا": 0, "ب": 1, "ج": 2, "د": 3, "ه": 4, "و": 5,
                  "1": 0, "2": 1, "3": 2, "4": 3,
                };
                const normL = correctStr.toLowerCase();
                if (letterMap[normL] !== undefined && letterMap[normL] < options.length) {
                  correctIndex = letterMap[normL];
                } else {
                  // Try to match the option string itself
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
            // Determine dominant question type for the category
            categoriesMap[cat] = {
              title: cat,
              type: q.options ? "mcq" : "complete",
              randomize: true,
              questions: [],
            };
          }
          const { category, ...cleanQ } = q;
          categoriesMap[cat].questions.push(cleanQ);
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
 * Generates and downloads a beautifully formatted Excel (.xlsx) template for Quizify questions.
 */
export function downloadExcelTemplate() {
  const sampleData = [
    {
      "Category (الفئة)": "العقيدة والطقس (Theology)",
      "Type (النوع: mcq/complete)": "mcq",
      "Question (السؤال)": "كم عدد المجامع المسكونية المعترف بها في الكنيسة القبطية؟",
      "Option 1 (الخيار 1)": "1",
      "Option 2 (الخيار 2)": "2",
      "Option 3 (الخيار 3)": "3",
      "Option 4 (الخيار 4)": "4",
      "Correct Answer (الإجابة الصحيحة: 1-4 أو النص)": "3",
      "Points (النقاط)": 10,
    },
    {
      "Category (الفئة)": "العقيدة والطقس (Theology)",
      "Type (النوع: mcq/complete)": "mcq",
      "Question (السؤال)": "مَن قائل عبارة: «لولا أثناسيوس لصار العالم كله أريوسيًّا»؟",
      "Option 1 (الخيار 1)": "القديس جيروم",
      "Option 2 (الخيار 2)": "القديس غريغوريوس النزينزي",
      "Option 3 (الخيار 3)": "الأنبا قزمان",
      "Option 4 (الخيار 4)": "الأنبا أنطونيوس",
      "Correct Answer (الإجابة الصحيحة: 1-4 أو النص)": "1",
      "Points (النقاط)": 10,
    },
    {
      "Category (الفئة)": "محفوظات (Verses)",
      "Type (النوع: mcq/complete)": "complete",
      "Question (السؤال)": "هناك صعدت القبائل، قبائل الرب شهادة ــــــــــــ",
      "Option 1 (الخيار 1)": "",
      "Option 2 (الخيار 2)": "",
      "Option 3 (الخيار 3)": "",
      "Option 4 (الخيار 4)": "",
      "Correct Answer (الإجابة الصحيحة: 1-4 أو النص)": "لإسرائيل",
      "Points (النقاط)": 10,
    },
    {
      "Category (الفئة)": "General Knowledge",
      "Type (النوع: mcq/complete)": "mcq",
      "Question (السؤال)": "Which planet in our solar system is known as the Red Planet?",
      "Option 1 (الخيار 1)": "Venus",
      "Option 2 (الخيار 2)": "Mars",
      "Option 3 (الخيار 3)": "Jupiter",
      "Option 4 (الخيار 4)": "Saturn",
      "Correct Answer (الإجابة الصحيحة: 1-4 أو النص)": "2",
      "Points (النقاط)": 10,
    },
    {
      "Category (الفئة)": "Science & Tech",
      "Type (النوع: mcq/complete)": "mcq",
      "Question (السؤال)": "What is the chemical symbol for Gold?",
      "Option 1 (الخيار 1)": "Ag",
      "Option 2 (الخيار 2)": "Fe",
      "Option 3 (الخيار 3)": "Au",
      "Option 4 (الخيار 4)": "Pb",
      "Correct Answer (الإجابة الصحيحة: 1-4 أو النص)": "Au",
      "Points (النقاط)": 15,
    },
    {
      "Category (الفئة)": "Bible Trivia",
      "Type (النوع: mcq/complete)": "complete",
      "Question (السؤال)": "In the beginning God created the ___ and the ___",
      "Option 1 (الخيار 1)": "",
      "Option 2 (الخيار 2)": "",
      "Option 3 (الخيار 3)": "",
      "Option 4 (الخيار 4)": "",
      "Correct Answer (الإجابة الصحيحة: 1-4 أو النص)": "heavens, earth",
      "Points (النقاط)": 10,
    },
  ];

  // 1. Create workbook and worksheet
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(sampleData);

  // 2. Set nice column widths for Excel
  worksheet["!cols"] = [
    { wch: 28 }, // Category
    { wch: 25 }, // Type
    { wch: 45 }, // Question
    { wch: 22 }, // Option 1
    { wch: 22 }, // Option 2
    { wch: 22 }, // Option 3
    { wch: 22 }, // Option 4
    { wch: 38 }, // Correct Answer
    { wch: 15 }, // Points
  ];

  // 3. Append sheet and download
  XLSX.utils.book_append_sheet(workbook, worksheet, "Quiz Questions");
  XLSX.writeFile(workbook, "Quizify_Questions_Template.xlsx");
}
