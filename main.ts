import { basename } from "https://deno.land/std@0.137.0/path/mod.ts";
interface Token {
  name: string;
  params: string[];
  output: string[];
}

const typify = (str: string[]): string[] =>
  str.map((item) => {
    switch (item) {
      case "int":
        return `"i32"`;
      default:
        return `"${item}"`;
    }
  });

function getExtension(): string {
  let libSuffix = "dll";
  switch (Deno.build.os) {
    case "windows":
      libSuffix = "dll";
      break;
    case "darwin":
      libSuffix = "dylib";
      break;
    case "linux":
      libSuffix = "so";
      break;
  }
  return libSuffix;
}

class Parser {
  #input: string[];
  #output: Token[] = [];
  constructor(input: string) {
    this.#input = input.match(
      /(?:\/\*(?:[^\*]|\**[^\*\/])*\*+\/)|(?:\/\/[\S ]*)/g,
    )!;
    this.#clean();
    for (const line of this.#input) {
      this.#output.push(this.tokenize(line));
    }
  }
  #clean() {
    this.#input = this.#input.map((line) =>
      line.replace("//", "").replace(/(\r\n|\n|\r)/gm, "").replace(
        /\/\*|\*\//g,
        "",
      )
    );
  }
  tokenize(line: string): Token {
    const [name, parameters, output] = line.replace(
      /[\])}[{(]/g,
      "",
    ).split("->");
    return {
      name: name.trim(),
      params: typify(parameters.replace(/ /g, "").split(",")),
      output: typify(output.replace(/ /g, "").split(",")),
    };
  }
  get output() {
    return this.#output;
  }
}
const symbols = [];
const fileName = Deno.args[0];
const fileNameFormat = basename(fileName);
const name = fileNameFormat.split(".")[0];
const fileContent = Deno.readTextFileSync(fileName);
const ast = new Parser(fileContent).output;
for (const token of ast) {
  symbols.push(
    `"${token.name}": { parameters: [${token.params}], result: ${
      token.output[0]
    } },`,
  );
}
const file = `export const _lib = Deno.dlopen("./${fileNameFormat.replace("v", getExtension())}", {
${symbols.join("\n")}
});
export { _lib as default };`;
Deno.writeTextFileSync(`${fileName.replace(fileNameFormat,`${name}_bindings.ts`)}`, file);
console.log(`🚀 successfully generated: ${fileName.replace(fileNameFormat,`${name}_bindings.ts`)}`);
