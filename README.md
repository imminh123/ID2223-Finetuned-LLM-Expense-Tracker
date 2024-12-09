<img src="https://github.com/imminh123/ID2223-Finetuned-LLM-Expense-Tracker/blob/main/images/cover.jpg?raw=true" alt="Cover Image" style="width: 100%; aspect-ratio: 16/9;">

# Your Sassy Expense Tracker Assistant
A sassy assistant powered by fine-tuned Llama-3.2-1B for expense tracking.

### [Demo URL](https://id-2223-finetuned-llm-expense-tracker.vercel.app/)

## Overview
We are building a sassy assistant to help track your spending. The assistant is powered by a Large Language Model (LLM). Our goal is to evaluate different LLMs suitable for this task. WSpecifically, we will compare two base models, `unsloth/Llama-3.2-1B-Instruct` and `unsloth/Qwen2.5-0.5B-Instruct`, both before and after fine-tuning them on various instruction-following datasets.

### UI
The UI consists of two main components: a chat interface for logging expenses and conversing with your assistant, and a list interface for displaying your expense records so far.

#### Input Format
To keep our assistant happy, make sure your input follows this format: **item price date** (the date can be `today` or in DD/MM/YYYY format). It will scold you otherwise ⚠️.

<div style="display: flex; justify-content: space-around;">
  <img src="https://github.com/imminh123/ID2223-Finetuned-LLM-Expense-Tracker/blob/main/images/chat_ui.png?raw=true" alt="Image 1" style="width: 35%;"/>
  <img src="https://github.com/imminh123/ID2223-Finetuned-LLM-Expense-Tracker/blob/main/images/expense_list.png?raw=true" alt="Image 2" style="width: 35%;"/>
</div>

### Model Fine-tunning
#### Parameter Optimization (Model centric)
We utilized **LoRA** for all models to efficiently fine-tune their parameters. Due to resource and time constraints, we focused on the most impactful parameter—step training. Each model was fine-tuned for one full epoch to achieve optimal performance within the given constraints.

#### Dataset Selection (Data centric)
- We experiment with the [Thermostatic/ShareGPT_Capybara](https://huggingface.co/datasets/Thermostatic/ShareGPT_Capybara) (an unofficial version mapped to the ShareGPT format) - a relatively popular dataset featuring over 10,000 multi-turn examples. However, the results were not positive, and detailed evaluations are provided below.

### Qwen2.5-0.5B vs Llama-3.2-1B
In addition to the default `Llama-3.2-1B-Instruct` model used in the blog post, we experimented with a smaller model, `Qwen2.5-0.5B-Instruct`. Results showed that, for the same task and using a larger fine-tuning dataset, `Qwen2.5-0.5B` performed on par with `Llama-3.2-1B`, which make it a better candidate in this case due to resource-constrained environments.

### Evaluation task
1.	JSON Parsing: Parsing user queries into structured JSON format for storage and future analytical queries.
2.	Reasoning: A simple Fibonacci sequence completion task is enough to observe differences in reasoning capabilities for small models.

| Model                                      | Finetune Dataset         | JSON Parsing | Reasoning   | [Sample Response 1](#prompt-for-json-parsing)   | [Sample Response 2](#prompt-for-generating-fibonacci-sequence)               |
|--------------------------------------------|--------------------------|--------------|-------------|----------------------------------|----------------------------------|
| Llama-3.2-1B-Instruct                      | None                     | ❌           | ✅          | "**Input Parsing Function**\n\n```javascript\nfunction parseInput(input) \n  const pattern = /^(\\w+) (\\d+) (\\d{2}/\\d{2}/\\d{4})$/;\n"        | "1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89,..." |
| Llama-3.2-1B-Instruct-Finetune-FineTome-100K | FineTome-100K            | ✅           | ✅          | "{\n  \"type\": \"expense\",\n  \"name\": \"kfc\",\n  \"amount\": 200,\n  \"date\": \"09/12/2024\"\n}"    | "1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89,..." |
| Qwen2.5-0.5B-Instruct                      | None                     | ❌           | ❌          | "```json\n{\n  \"type\": \"expense\",\n  \"name\": \"kfc\",\n  \"amount\": 200,\n  \"date\": \"09/12/2024\"\n}\n```" | 14, 23, 34.  |
| Qwen2.5-0.5B-Instruct-Finetune-Capybara    | Capybara                 | ❌           | ❌          | "```json\n{\n  \"type\": \"expense\",\n  \"name\": \"kfc\",\n  \"amount\": 200,\n  \"date\": \"09/12/2024\"\n}\n```" | 7, 13, 21, 34, 55, 89, 144
| Qwen2.5-0.5B-Instruct-Finetune-FineTome-100K | FineTome-100K            | ✅           | ✅          | "{\n  \"type\": \"expense\",\n  \"name\": \"kfc\",\n  \"amount\": 200,\n  \"date\": \"09/12/2024\"\n}"     | 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89,..." |


### All models can be found at
[Llama-3.2-1B-Instruct-FineTome-100K](https://huggingface.co/minhnguyen5293/merged_16bit_1_full_epoch)

[Qwen2.5-0.5B-Instruct-4bit-Finetune-FineTome-100K](https://huggingface.co/minhnguyen5293/Qwen2.5-0.5B-Instruct-4bit-Finetune-FineTome-100K)

[Qwen2.5-0.5B-Instruct-4bit-Finetune-Capybara](https://huggingface.co/minhnguyen5293/Qwen2.5-0.5B-Instruct-4bit-Finetune-Capybara)

### Featured Datasets
[Thermostatic/ShareGPT_Capybara](https://huggingface.co/datasets/Thermostatic/ShareGPT_Capybara)

[mlabonne/FineTome-100k](https://huggingface.co/datasets/mlabonne/FineTome-100k)

### Appendix
#### Weight checkpoint to Google Drive

In resource-constrain enviroment (Google Colab will wipe out the temporary storage after a while), we can checkpoint the weight periodically to an external storage like Google Drive.
```
import os
from google.colab import drive
# drive.flush_and_unmount()
MOUNTPOINT = './outputs-drive'
DATADIR = os.path.join(MOUNTPOINT, 'MyDrive', 'model_outputs')
drive.mount(MOUNTPOINT)
```

and update the `output_dir` and `save_steps` accordingly.
```
checkpoint_dir = "./outputs-qwen-capybara"

trainer = SFTTrainer(
    ...
        save_steps = 200,
        output_dir = checkpoint_dir,
    ...
)
```
#### Prompt for JSON parsing
```
Do not write code. Parse the input string and return JSON format. Here's the field: type (default "expense"), name, amount, date (dd/MM/yyyy) \n Input: ${userInput}
```

#### Prompt for generating Fibonacci sequence.
```
Continue the fibonnaci sequence: 1, 1, 2, 3, 5, 8,
```

