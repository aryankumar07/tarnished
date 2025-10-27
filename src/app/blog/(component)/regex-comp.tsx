export const Tester = () => {
  return (
    <div className="font-extrabold text-9xl text-blue-600 text-center my-8">
      Regex Guide
    </div>
  );
};

interface RegexSectionProps {
  title: string;
  children: React.ReactNode;
}

export const RegexSection: React.FC<RegexSectionProps> = ({ title, children }) => {
  return (
    <section className="my-6">
      <h2 className="text-2xl font-bold text-foreground mb-4">{title}</h2>
      <div className="text-foreground leading-relaxed">{children}</div>
    </section>
  );
};



interface RegexExampleProps {
  pattern: string;
  description: string;
}

export const RegexExample: React.FC<RegexExampleProps> = ({ pattern, description }) => {
  return (
    <div className="bg-black p-4 rounded-lg my-4">
      <code className="bg-black text-foreground px-2 py-1 rounded">{pattern}</code>
      <p className="mt-2">{description}</p>
    </div>
  );
};


interface CheatSheetItem {
  pattern: string;
  description: string;
}

interface RegexCheatSheetProps {
  items: CheatSheetItem[];
}

export const RegexCheatSheet: React.FC<RegexCheatSheetProps> = ({ items }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
      {items.map((item, index) => (
        <div key={index} className="bg-slate-700 p-3 rounded-lg">
          <code className="font-mono text-blue-700">{item.pattern}</code>
          <p className="text-sm text-foreground">{item.description}</p>
        </div>
      ))}
    </div>
  );
};



interface CodeBlockProps {
  language: string;
  code: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ language, code }) => {
  return (
    <pre className="bg-black text-foreground p-4 rounded-lg my-4 overflow-x-auto">
      <code className={`language-${language}`}>{code}</code>
    </pre>
  );
};
