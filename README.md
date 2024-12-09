# ID2223-Finetuned-LLM-Expense-Tracker
A sassy assistant powered by fine-tuned Llama-3.2-1B for expense tracking.

[Demo URL](https://id-2223-finetuned-llm-expense-tracker.vercel.app/)

**All models can be found at:** 

[Llama-3.2-1B-Instruct-FineTome-100K](https://huggingface.co/minhnguyen5293/merged_16bit_1_full_epoch)
[Qwen2.5-0.5B-Instruct-4bit-Finetune-FineTome-100K](https://huggingface.co/minhnguyen5293/Qwen2.5-0.5B-Instruct-4bit-Finetune-FineTome-100K)
[Qwen2.5-0.5B-Instruct-4bit-Finetune-Capybara](https://huggingface.co/minhnguyen5293/Qwen2.5-0.5B-Instruct-4bit-Finetune-Capybara)

**Finetune Datasets**
1. [Thermostatic/ShareGPT_Capybara](https://huggingface.co/datasets/Thermostatic/ShareGPT_Capybara)
2. [mlabonne/FineTome-100k](https://huggingface.co/datasets/mlabonne/FineTome-100k)

## Overview
We are building a sassy assistant to help track your spending. The assistant is powered by a Large Language Model (LLM). Our goal is to evaluate different LLMs suitable for this task. WSpecifically, we will compare two base models, `unsloth/Llama-3.2-1B-Instruct` and `unsloth/Qwen2.5-0.5B-Instruct`, both before and after fine-tuning them on various instruction-following datasets.

### UI


### Evaluation task
1.	JSON Parsing: Parsing user queries into structured JSON format for storage and future analytical queries.
2.	Reasoning: A simple Fibonacci sequence completion task is enough to observe differences in reasoning capabilities for small models.

| Model                                      | Finetune Dataset         | JSON Parsing | Reasoning   | Sample Response 1               | Sample Response 2               |
|--------------------------------------------|--------------------------|--------------|-------------|----------------------------------|----------------------------------|
| Llama-3.2-1B-Instruct                      | None                     | ❌           | ✅          | "**Input Parsing Function**\n\n```javascript\nfunction parseInput(input) \n  const pattern = /^(\\w+) (\\d+) (\\d{2}/\\d{2}/\\d{4})$/;\n"        | "1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89,..." |
| Llama-3.2-1B-Instruct-Finetune-FineTome-100K | FineTome-100K            | ✅           | ✅          | "{\n  \"type\": \"expense\",\n  \"name\": \"kfc\",\n  \"amount\": 200,\n  \"date\": \"09/12/2024\"\n}"    | "1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89,..." |
| Qwen2.5-0.5B-Instruct                      | None                     | ❌           | ❌          | "```json\n{\n  \"type\": \"expense\",\n  \"name\": \"kfc\",\n  \"amount\": 200,\n  \"date\": \"09/12/2024\"\n}\n```"
 | 14, 23, 34.  |
| Qwen2.5-0.5B-Instruct-Finetune-Capybara    | Capybara                 | ❌           | ❌          | "```json\n{\n  \"type\": \"expense\",\n  \"name\": \"kfc\",\n  \"amount\": 200,\n  \"date\": \"09/12/2024\"\n}\n```" | 7, 13, 21, 34, 55, 89, 144
| Qwen2.5-0.5B-Instruct-Finetune-FineTome-100K | FineTome-100K            | ✅           | ✅          | "{\n  \"type\": \"expense\",\n  \"name\": \"kfc\",\n  \"amount\": 200,\n  \"date\": \"09/12/2024\"\n}"     | 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89,..." |


### Appendix
1. Prompt for JSON parsing
```
Do not write code. Parse the input string and return JSON format. Here's the field: type (default "expense"), name, amount, date (dd/MM/yyyy) \n Input: ${userInput}
```



