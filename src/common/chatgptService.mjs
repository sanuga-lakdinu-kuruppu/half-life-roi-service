import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const generateMCQQuestions = async (userName) => {
  try {
    const systemMessage =
      process.env.QUIZ_SYSTEM_MESSAGE ||
      `You are an expert in nuclear technology economics and non-energy applications of nuclear technologies. Generate 15 sophisticated multiple choice questions (MCQs) focused specifically on "Understanding the Economic Issues of Non-Energy Applications of Nuclear Technologies."

       The questions should cover:
       1. Economic feasibility and cost-benefit analysis of nuclear applications
       2. Market dynamics and commercialization challenges
       3. Regulatory compliance costs and economic impacts
       4. Investment requirements and funding mechanisms
       5. Economic comparison with alternative technologies
       6. Risk assessment and insurance considerations
       7. Supply chain economics and material costs
       8. Economic benefits and ROI analysis
       9. International trade and economic policies
       10. Workforce development and economic implications

       Focus on applications such as:
       - Medical applications (radiotherapy, medical imaging, sterilization)
       - Industrial applications (radiography, material testing, food preservation)
       - Agricultural applications (crop improvement, pest control, food irradiation)
       - Environmental applications (water treatment, pollution monitoring)
       - Research and development applications
       - Security and defense applications

       Make questions challenging but accessible, covering both theoretical concepts and practical economic considerations. Include questions about:
       - Capital investment requirements
       - Operational costs and maintenance
       - Regulatory compliance expenses
       - Market competition and pricing
       - Economic sustainability
       - Risk management costs
       - International economic factors
       
       Return the response in the following JSON format:
       {
         "questions": [
           {
             "question": "What is the question text?",
             "options": ["Option A", "Option B", "Option C", "Option D"],
             "correctAnswer": "Option A",
             "explanation": "Detailed explanation of why this is correct, including economic reasoning"
           }
         ]
       }
       
       Ensure questions are intellectually stimulating and reflect real-world economic challenges in the nuclear technology sector.`;

    const userMessage =
      process.env.QUIZ_USER_MESSAGE ||
      `Generate 15 sophisticated MCQ questions for user ${userName} focused on the economic issues of non-energy applications of nuclear technologies. Make questions challenging, comprehensive, and reflect real-world economic considerations in this specialized field.`;

    const response = await axios.post(
      process.env.OPENAI_API_URL ||
        "https://api.openai.com/v1/chat/completions",
      {
        model: process.env.OPENAI_MODEL || "gpt-4.1-nano",
        messages: [
          {
            role: "system",
            content: systemMessage,
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const content = response.data.choices[0].message.content;
    
    // Try to parse the JSON response
    try {
      const parsedContent = JSON.parse(content);
      
      // Validate the structure
      if (parsedContent.questions && Array.isArray(parsedContent.questions)) {
        return {
          success: true,
          questions: parsedContent.questions,
          message: "Questions generated successfully",
        };
      } else {
        throw new Error("Invalid response structure");
      }
    } catch (parseError) {
      // If JSON parsing fails, return error
      return {
        success: false,
        error: "Failed to parse questions from ChatGPT response",
        rawResponse: content,
      };
    }
    } catch (error) {
    console.error("Error generating MCQ questions:", error);
    
    if (error.response) {
      // OpenAI API error
      return {
        success: false,
        error: `OpenAI API Error: ${
          error.response.data?.error?.message || error.message
        }`,
        status: error.response.status,
      };
    } else if (error.request) {
      // Network error
      return {
        success: false,
        error: "Network error - unable to reach OpenAI API",
      };
    } else {
      // Other error
      return {
        success: false,
        error: error.message,
      };
    }
  }
};

// Fallback function to generate questions if ChatGPT fails
export const generateFallbackQuestions = (userName) => {
  const fallbackQuestions = [
    {
      question:
        "What is the primary economic challenge in commercializing medical radioisotope production?",
      options: [
        "High initial capital investment",
        "Low market demand",
        "Simple regulatory requirements",
        "Abundant supply of raw materials",
      ],
      correctAnswer: "High initial capital investment",
      explanation:
        "Medical radioisotope production requires significant capital investment in specialized facilities, equipment, and regulatory compliance, making it economically challenging despite high market demand.",
    },
    {
      question:
        "Which economic factor most significantly impacts the cost-effectiveness of food irradiation facilities?",
      options: [
        "Energy costs",
        "Labor costs",
        "Regulatory compliance costs",
        "Transportation costs",
      ],
      correctAnswer: "Regulatory compliance costs",
      explanation:
        "Regulatory compliance costs, including licensing, safety measures, and ongoing inspections, represent the largest economic burden for food irradiation facilities, often exceeding 40% of total operational costs.",
    },
    {
      question:
        "What is the main economic advantage of nuclear-based industrial radiography over conventional methods?",
      options: [
        "Lower initial investment",
        "Higher accuracy and reliability",
        "Reduced regulatory requirements",
        "Faster processing times",
      ],
      correctAnswer: "Higher accuracy and reliability",
      explanation:
        "Nuclear-based industrial radiography provides superior accuracy and reliability in non-destructive testing, leading to long-term cost savings through reduced inspection failures and improved quality control.",
    },
    {
      question:
        "Which economic consideration is most critical when evaluating nuclear technology for water treatment applications?",
      options: [
        "Initial capital costs",
        "Operational efficiency",
        "Scale of operation",
        "Regulatory approval timeline",
      ],
      correctAnswer: "Scale of operation",
      explanation:
        "The economic viability of nuclear water treatment depends heavily on scale of operation, as larger facilities can achieve economies of scale that make the technology cost-competitive with conventional methods.",
    },
    {
      question:
        "What percentage of total project costs typically represents regulatory compliance in nuclear medical applications?",
      options: ["5-10%", "15-25%", "30-40%", "50-60%"],
      correctAnswer: "30-40%",
      explanation:
        "Regulatory compliance costs typically represent 30-40% of total project costs in nuclear medical applications, including licensing, safety systems, monitoring, and ongoing regulatory oversight.",
    },
    {
      question:
        "Which economic factor most influences the international trade of nuclear technology components?",
      options: [
        "Currency exchange rates",
        "Export control regulations",
        "Transportation costs",
        "Market competition",
      ],
      correctAnswer: "Export control regulations",
      explanation:
        "Export control regulations significantly impact the economics of international nuclear technology trade, affecting licensing costs, compliance requirements, and market access, often determining the feasibility of international projects.",
    },
    {
      question:
        "What is the typical payback period for investment in nuclear sterilization facilities?",
      options: ["1-2 years", "3-5 years", "7-10 years", "15-20 years"],
      correctAnswer: "7-10 years",
      explanation:
        "Nuclear sterilization facilities typically have a payback period of 7-10 years due to high initial capital costs, regulatory requirements, and the need for specialized infrastructure and safety systems.",
    },
    {
      question:
        "Which economic metric is most important for evaluating the viability of nuclear crop improvement programs?",
      options: [
        "Return on Investment (ROI)",
        "Net Present Value (NPV)",
        "Internal Rate of Return (IRR)",
        "Benefit-Cost Ratio (BCR)",
      ],
      correctAnswer: "Benefit-Cost Ratio (BCR)",
      explanation:
        "Benefit-Cost Ratio is most important for nuclear crop improvement programs as it accounts for both direct economic benefits (improved yields) and indirect benefits (food security, environmental impact) relative to implementation costs.",
    },
    {
      question:
        "What is the primary economic barrier to widespread adoption of nuclear-based material testing in small industries?",
      options: [
        "High operational costs",
        "Lack of technical expertise",
        "Regulatory complexity",
        "Limited market demand",
      ],
      correctAnswer: "Lack of technical expertise",
      explanation:
        "The lack of technical expertise represents the primary economic barrier, as small industries face high costs for training personnel, hiring specialists, or outsourcing nuclear material testing services.",
    },
    {
      question:
        "Which economic factor most affects the competitiveness of nuclear technology in environmental monitoring applications?",
      options: [
        "Equipment costs",
        "Operational efficiency",
        "Alternative technology costs",
        "Regulatory requirements",
      ],
      correctAnswer: "Alternative technology costs",
      explanation:
        "The competitiveness of nuclear environmental monitoring depends heavily on the costs of alternative technologies, as nuclear methods must demonstrate clear economic advantages over conventional monitoring approaches.",
    },
    {
      question:
        "What is the typical annual operational cost for a nuclear research facility focused on non-energy applications?",
      options: [
        "$500,000 - $1 million",
        "$2-5 million",
        "$10-20 million",
        "$50-100 million",
      ],
      correctAnswer: "$10-20 million",
      explanation:
        "Nuclear research facilities for non-energy applications typically have annual operational costs of $10-20 million, including personnel, equipment maintenance, regulatory compliance, and safety systems.",
    },
    {
      question:
        "Which economic consideration is most critical for nuclear technology commercialization in developing countries?",
      options: [
        "Initial investment capacity",
        "Market size",
        "Regulatory framework",
        "Technical infrastructure",
      ],
      correctAnswer: "Initial investment capacity",
      explanation:
        "Initial investment capacity is the most critical factor, as developing countries often lack the capital required for nuclear technology infrastructure, making financing mechanisms and international cooperation essential for project viability.",
    },
    {
      question:
        "What percentage of nuclear technology projects typically experience cost overruns due to regulatory delays?",
      options: ["10-20%", "30-40%", "50-60%", "70-80%"],
      correctAnswer: "50-60%",
      explanation:
        "Approximately 50-60% of nuclear technology projects experience cost overruns due to regulatory delays, which can increase project costs by 20-40% and significantly impact economic viability.",
    },
    {
      question:
        "Which economic factor most influences the decision to invest in nuclear security applications?",
      options: [
        "Direct financial returns",
        "Risk mitigation value",
        "Operational efficiency",
        "Regulatory compliance",
      ],
      correctAnswer: "Risk mitigation value",
      explanation:
        "The decision to invest in nuclear security applications is primarily driven by risk mitigation value rather than direct financial returns, as these technologies provide critical protection against security threats and potential economic losses.",
    },
    {
      question:
        "What is the economic impact of workforce development requirements in the nuclear technology sector?",
      options: [
        "Minimal impact on project costs",
        "10-15% of total project costs",
        "25-35% of total project costs",
        "50% or more of total project costs",
      ],
      correctAnswer: "25-35% of total project costs",
      explanation:
        "Workforce development requirements represent 25-35% of total project costs in the nuclear technology sector, including specialized training, certification programs, and ongoing professional development for technical personnel.",
    },
  ];

    return {
    success: true,
    questions: fallbackQuestions,
    message: "Fallback questions generated successfully",
  };
};
