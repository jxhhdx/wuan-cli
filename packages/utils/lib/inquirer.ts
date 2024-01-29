import * as inquirer from 'inquirer';

interface PromptOptions {
  choices?: any[];
  defaultValue: any;
  message: string;
  type?: any; // Add any other supported types if needed
  require?: boolean;
  mask?: string;
}

export default function prompt({ choices, defaultValue, message, type = 'list', require = true, mask = '*' }: PromptOptions): Promise<any> {
  const options: inquirer.QuestionCollection = {
    type,
    name: 'name',
    message,
    default: defaultValue,
    require,
    mask,
  };

  if (type === 'list' && choices) {
    options.choices = choices;
  }

  return inquirer.prompt(options).then((answer) => answer.name);
}
